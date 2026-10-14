import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Skeleton } from '@chakra-ui/react';
import Schedule from '../schedule/schedule';
import AccountGate from '../account/AccountGate';
import PageTitle from '../page-title/PageTitle';
import useUserStore from '../../store/useUserStore';
import { BACKEND_URL } from '../../utils/backendUrl';
import { formatBoard } from '../../utils/format';
import { DAYS, describeStart, formatTimeRange } from '../../utils/schedule';

const EnrolledCourses = () => {
  const user = useUserStore((state) => state.user);
  const accessToken = useUserStore((state) => state.accessToken);
  const refreshSession = useUserStore((state) => state.refreshSession);
  const [enrollments, setEnrollments] = useState([]);
  const [status, setStatus] = useState('loading');
  const studentId = user?.student?._id;

  const load = useCallback(async () => {
    if (!studentId) {
      setStatus('ready');
      return;
    }
    setStatus('loading');

    const request = (token) =>
      fetch(`${BACKEND_URL}/api/enrollment/studentEnrollments/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

    try {
      let response = await request(accessToken);
      if (response.status === 401) {
        const session = await refreshSession();
        if (session?.token) response = await request(session.token);
      }

      // The API answers 404 when the student has no enrollments yet.
      if (response.status === 404) {
        setEnrollments([]);
        setStatus('ready');
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setEnrollments(Array.isArray(data) ? data.filter((item) => item?.courseDetails) : []);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
    }
  }, [accessToken, refreshSession, studentId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!studentId) {
    return (
      <div className="account__empty">
        <h2>Course bookings are for student accounts</h2>
        <p>This account isn't a student account, so it has no course bookings.</p>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="enrolled-list">
        {[0, 1].map((key) => <Skeleton key={key} height="120px" borderRadius="16px" startColor="#eef2f8" endColor="#f7f9fc" />)}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="account__empty">
        <h2>Your courses couldn't be loaded</h2>
        <p>Check your connection and try again.</p>
        <Button onClick={load}>Try again</Button>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="account__empty">
        <h2>You haven't reserved any seats yet</h2>
        <p>Find a course, pick a batch that fits your week and reserve your seat. It will show up here.</p>
        <Button as={RouterLink} to="/courses">Browse courses</Button>
      </div>
    );
  }

  const batches = enrollments.flatMap((item) =>
    (item.courseDetails.batches || []).map((batch) => ({ ...batch, courseTitle: item.courseDetails.title }))
  );
  const schedules = enrollments.flatMap((item) => item.courseDetails.schedules || []);

  return (
    <>
      <ul className="enrolled-list">
        {enrollments.map((item, index) => {
          const course = item.courseDetails;
          const batch = course.batches?.[0];
          const times = (course.schedules || []).slice().sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));
          return (
            <li key={`${course._id}-${batch?._id || index}`} className="enrolled">
              <div className="enrolled__image">{course.imageUrl && <img src={course.imageUrl} alt="" />}</div>
              <div>
                <h2>{course.title}</h2>
                <p className="enrolled__meta">
                  {[batch?.batchName, course.institute?.name, formatBoard(course.board)].filter(Boolean).join(', ')}
                  {batch?.startDate ? `. ${describeStart(batch.startDate)}` : ''}
                </p>
                {times.length > 0 ? (
                  <p className="enrolled__times">
                    {times.map((schedule) => (
                      <span key={schedule._id}>{schedule.day.slice(0, 3)} {formatTimeRange(schedule.startHour, schedule.duration)}</span>
                    ))}
                  </p>
                ) : (
                  <p className="enrolled__meta">Class times will be shared by the institute.</p>
                )}
              </div>
              <Button as={RouterLink} to={`/course-details/${course._id}`} variant="outline">View course</Button>
            </li>
          );
        })}
      </ul>

      {schedules.length > 0 && (
        <section className="account__section" aria-labelledby="my-timetable-title">
          <h2 id="my-timetable-title">Your week</h2>
          <Schedule batches={batches} schedules={schedules} />
        </section>
      )}
    </>
  );
};

const StudentCourses = () => (
  <AccountGate title="My courses" message="Log in to see the courses you've reserved and your weekly timetable.">
    <div className="page account">
      <PageTitle title="My courses" />
      <header className="account__header">
        <h1>My courses</h1>
        <p>Seats you've reserved. Pay each institute on your first day of class.</p>
      </header>
      <EnrolledCourses />
    </div>
  </AccountGate>
);

export default StudentCourses;
