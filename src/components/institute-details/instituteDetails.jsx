import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, Skeleton, SkeletonText } from '@chakra-ui/react';
import { FiGlobe, FiMail, FiPhone } from 'react-icons/fi';
import CourseCard from '../course-card/courseCard';
import InstructorCard from '../instructor-card/instructorCard';
import MapWithPlusCode from '../map/map';
import PageTitle from '../page-title/PageTitle';
import { BACKEND_URL } from '../../utils/backendUrl';
import { formatRupees } from '../../utils/format';
import '../course-details/courseDetails.css';
import '../instructor-section/instructorSection.css';
import '../schedule/schedule.css';
import './instituteDetails.css';

const getJson = async (path) => {
  const response = await fetch(`${BACKEND_URL}${path}`);
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const InstituteDetails = () => {
  const { id } = useParams();
  const [institute, setInstitute] = useState(null);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [instituteData, courseData, facultyData] = await Promise.all([
        getJson(`/api/institutes/${id}`),
        getJson(`/api/courses/getCourseByInstitute/${id}`).catch(() => []),
        getJson(`/api/faculty/getFacultiesByInstitute/${id}`).catch(() => []),
      ]);
      setInstitute(instituteData);
      setCourses(Array.isArray(courseData) ? courseData.filter((course) => course.isActive !== false) : []);
      // Faculty rows point at a teacher; skip any whose teacher has been deleted.
      setTeachers(
        (Array.isArray(facultyData) ? facultyData : [])
          .map((faculty) => faculty.teacher_id)
          .filter((teacher) => teacher && typeof teacher === 'object')
      );
      setStatus('ready');
    } catch (error) {
      setStatus(error.status === 404 ? 'missing' : 'error');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading') {
    return (
      <div className="page course-page" aria-busy="true">
        <Skeleton height="220px" borderRadius="24px" mb={6} />
        <Skeleton height="36px" width="40%" mb={4} />
        <SkeletonText noOfLines={2} maxW="480px" />
      </div>
    );
  }

  if (status !== 'ready') {
    return (
      <div className="page course-page">
        <PageTitle title="Institute not found" />
        <div className="course-page__state">
          <h1>{status === 'missing' ? 'This institute is no longer listed' : "This institute couldn't be loaded"}</h1>
          <p>{status === 'missing' ? 'Browse the other institutes on AoParhein instead.' : 'Check your connection and try again.'}</p>
          {status === 'error' && <Button onClick={load} mr={3}>Try again</Button>}
          <Button as={RouterLink} to="/institutes" variant="outline">All institutes</Button>
        </div>
      </div>
    );
  }

  const coordinates = institute.location?.coordinates;
  const hasCoordinates = Array.isArray(coordinates) && coordinates.length === 2;
  const contacts = [
    institute.contactNumber && { icon: FiPhone, label: institute.contactNumber, href: `tel:${institute.contactNumber.replace(/\s/g, '')}` },
    institute.email && { icon: FiMail, label: institute.email, href: `mailto:${institute.email}` },
    institute.website && { icon: FiGlobe, label: institute.website.replace(/^https?:\/\//, ''), href: institute.website.startsWith('http') ? institute.website : `https://${institute.website}` },
  ].filter(Boolean);

  const sections = [
    { id: 'courses', label: 'Courses' },
    teachers.length > 0 && { id: 'teachers', label: 'Teachers' },
    { id: 'location', label: 'Location' },
  ].filter(Boolean);

  return (
    <div className="page course-page institute-page">
      <PageTitle title={institute.name} />

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><RouterLink to="/institutes">Institutes</RouterLink></li>
          <li aria-current="page">{institute.name}</li>
        </ol>
      </nav>

      <header className="institute-hero">
        <div className="institute-hero__cover">
          {institute.pictureUrl && <img src={institute.pictureUrl} alt="" />}
        </div>
        <div className="institute-hero__identity">
          {institute.logoUrl ? (
            <img className="institute-hero__logo" src={institute.logoUrl} alt={`${institute.name} logo`} />
          ) : (
            <span className="institute-hero__logo institute-hero__logo--empty" aria-hidden="true">{institute.name?.[0]}</span>
          )}
          <div>
            <h1>{institute.name}</h1>
            <p>
              {courses.length} {courses.length === 1 ? 'course' : 'courses'}
              {institute.registrationFees != null && `, registration fee ${formatRupees(institute.registrationFees)}`}
            </p>
          </div>
        </div>
        {institute.about && <p className="institute-hero__about">{institute.about}</p>}
        {contacts.length > 0 && (
          <ul className="institute-hero__contacts">
            {contacts.map(({ icon: Icon, label, href }) => (
              <li key={href}>
                <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  <Icon aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <nav className="section-tabs" aria-label="On this page">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>{section.label}</a>
        ))}
      </nav>

      <section id="courses" className="course-section-block" aria-labelledby="institute-courses-title">
        <h2 id="institute-courses-title">Courses</h2>
        {courses.length > 0 ? (
          <div className="course-grid">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                id={course._id}
                title={course.title}
                fees={course.fees}
                board={course.board}
                imageUrl={course.imageUrl}
              />
            ))}
          </div>
        ) : (
          <p className="schedule-empty">This institute hasn't published any courses yet.</p>
        )}
      </section>

      {teachers.length > 0 && (
        <section id="teachers" className="course-section-block" aria-labelledby="institute-teachers-title">
          <h2 id="institute-teachers-title">Teachers</h2>
          <ul className="instructors__grid institute-page__teachers">
            {teachers.map((teacher) => (
              <li key={teacher._id}>
                <InstructorCard teacherName={teacher.name} image={teacher.pictureUrl} description={teacher.description} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="location" className="course-section-block" aria-labelledby="institute-location-title">
        <h2 id="institute-location-title">Location</h2>
        {institute.address && <p className="course-section-block__intro">{institute.address}</p>}
        {hasCoordinates && (
          <p className="course-section-block__intro">
            <a
              className="text-link"
              href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`}
              target="_blank"
              rel="noreferrer"
            >
              Get directions to {institute.name}
            </a>
          </p>
        )}
        <div className="course-map">
          <MapWithPlusCode plusCode={institute.plusCode} coordinates={coordinates} />
        </div>
      </section>
    </div>
  );
};

export default InstituteDetails;
