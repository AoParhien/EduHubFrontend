import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, InputGroup, InputLeftElement, Skeleton } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import PageTitle from '../page-title/PageTitle';
import { BACKEND_URL } from '../../utils/backendUrl';
import '../subjects/subjects.css';

const TeachersDirectory = () => {
  const [teachers, setTeachers] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/catalog/teachers`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setTeachers)
      .catch(() => setTeachers([]));
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (teachers || []).filter(
      (t) => !term || t.name.toLowerCase().includes(term) || t.subjects.some((s) => s.toLowerCase().includes(term))
    );
  }, [teachers, query]);

  return (
    <div className="page teacher-directory">
      <PageTitle title="Teachers" />
      <h1>Teachers</h1>
      <p className="teacher-directory__intro">
        Every teacher with classes on AoParhein. Open a profile to see where they teach and their timings.
      </p>
      <InputGroup maxW={{ base: '100%', md: '360px' }} mt={6}>
        <InputLeftElement pointerEvents="none" color="muted"><FiSearch /></InputLeftElement>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or subject, e.g. Physics" aria-label="Search teachers" borderRadius="full" />
      </InputGroup>

      {!teachers && (
        <div className="teacher-grid">
          {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} h="96px" borderRadius="16px" startColor="#eef2f8" endColor="#f7f9fc" />)}
        </div>
      )}

      {teachers && (
        visible.length ? (
          <ul className="teacher-grid">
            {visible.map((teacher) => (
              <li key={teacher._id}>
                <Link to={`/teachers/${teacher._id}`} className="teacher-tile">
                  {teacher.picture ? <img src={teacher.picture} alt="" loading="lazy" /> : <span className="teacher-tile__empty" aria-hidden="true">{teacher.name[0]}</span>}
                  <div>
                    <p className="teacher-tile__name">{teacher.name}</p>
                    <p className="teacher-tile__meta">
                      {Number(teacher.experience) > 0 ? `${teacher.experience} years teaching, ` : ''}
                      {teacher.institutes.length} {teacher.institutes.length === 1 ? 'institute' : 'institutes'}
                    </p>
                    <p className="teacher-tile__subjects">{teacher.subjects.slice(0, 3).join(', ')}{teacher.subjects.length > 3 ? ` +${teacher.subjects.length - 3}` : ''}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="directory__empty">
            <h2>{query ? `No teachers match "${query}"` : 'No teachers yet'}</h2>
          </div>
        )
      )}
    </div>
  );
};

export default TeachersDirectory;
