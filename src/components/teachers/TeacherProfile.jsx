import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, Skeleton } from '@chakra-ui/react';
import OfferingCard from '../offering-card/OfferingCard';
import PageTitle from '../page-title/PageTitle';
import { BACKEND_URL } from '../../utils/backendUrl';
import '../course-details/courseDetails.css';
import '../subjects/subjects.css';

// One teacher, every institute they teach at and all their classes.
const TeacherProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    setStatus('loading');
    fetch(`${BACKEND_URL}/api/catalog/teachers/${id}`)
      .then(async (res) => {
        if (res.status === 404) return setStatus('missing');
        if (!res.ok) throw new Error(res.status);
        setData(await res.json());
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="page teacher-page">
        <Skeleton h="132px" w="132px" borderRadius="full" mb={6} />
        <Skeleton h="320px" borderRadius="16px" />
      </div>
    );
  }

  if (status !== 'ready') {
    return (
      <div className="page teacher-page">
        <PageTitle title="Teacher not found" />
        <div className="course-page__state">
          <h1>{status === 'missing' ? 'This teacher isn’t listed' : 'This page couldn’t be loaded'}</h1>
          <p>Browse all teachers instead.</p>
          <Button as={RouterLink} to="/teachers">See all teachers</Button>
        </div>
      </div>
    );
  }

  const { teacher, institutes, offerings } = data;
  const years = Number(teacher.experience) || 0;

  return (
    <div className="page teacher-page">
      <PageTitle title={teacher.name} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><RouterLink to="/teachers">Teachers</RouterLink></li>
          <li aria-current="page">{teacher.name}</li>
        </ol>
      </nav>

      <header className="teacher-hero">
        {teacher.pictureUrl && !photoFailed ? (
          <img src={teacher.pictureUrl} alt="" className="teacher-hero__photo" onError={() => setPhotoFailed(true)} />
        ) : (
          <span className="teacher-hero__photo teacher-hero__photo--empty" aria-hidden="true">{teacher.name[0]}</span>
        )}
        <div>
          <h1>{teacher.name}</h1>
          {years > 0 && <p className="teacher-hero__meta">{years} {years === 1 ? 'year' : 'years'} teaching</p>}
          {teacher.description && <p className="teacher-hero__bio">{teacher.description}</p>}
          {institutes.length > 0 && (
            <ul className="teacher-page__institutes" aria-label="Teaches at">
              {institutes.map((inst) => (
                <li key={inst._id}>
                  <RouterLink to={`/institute/${inst._id}`}>
                    {inst.logoUrl && <img src={inst.logoUrl} alt="" />}
                    {inst.name}{inst.area ? `, ${inst.area}` : ''}
                  </RouterLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <h2>Classes</h2>
      {offerings.length ? (
        <ul className="offering-list">
          {offerings.map((offering) => (
            <li key={offering.courseId}><OfferingCard offering={offering} show="subject" /></li>
          ))}
        </ul>
      ) : (
        <div className="directory__empty">
          <h2>No classes open right now</h2>
          <p>{teacher.name} has no published classes at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
