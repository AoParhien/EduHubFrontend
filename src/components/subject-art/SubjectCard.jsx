import React from 'react';
import { Link } from 'react-router-dom';
import SubjectArt from './SubjectArt';
import { formatRupees } from '../../utils/format';
import './SubjectCard.css';

const teacherLine = (teachers, total) => {
  if (!teachers.length) return null;
  const first = teachers[0].name;
  const others = total - 1;
  return others > 0 ? `${first} and ${others} ${others === 1 ? 'other' : 'others'}` : first;
};

// A subject with its artwork, how many institutes teach it and who teaches it.
const SubjectCard = ({ subject }) => {
  const hasClasses = subject.offerings > 0;
  const teachers = subject.teachers || [];

  return (
    <Link to={`/subjects/${subject.slug}`} className={`subject-card${hasClasses ? '' : ' is-empty'}`}>
      <SubjectArt name={subject.name} label={subject.level} muted={!hasClasses} className="subject-card__art" />
      <div className="subject-card__body">
        <h3 className="subject-card__name">{subject.name}</h3>
        {hasClasses ? (
          <>
            <p className="subject-card__meta">
              {subject.institutes} {subject.institutes === 1 ? 'institute' : 'institutes'}
              <span aria-hidden="true"> · </span>
              from {formatRupees(subject.minFee)}/month
            </p>
            {teachers.length > 0 && (
              <div className="subject-card__teachers">
                <span className="subject-card__faces" aria-hidden="true">
                  {teachers.map((teacher) => (
                    teacher.picture
                      ? <img key={teacher.name} src={teacher.picture} alt="" loading="lazy" />
                      : <span key={teacher.name}>{teacher.name[0]}</span>
                  ))}
                </span>
                <span className="subject-card__teacher-names">{teacherLine(teachers, subject.teacherCount || teachers.length)}</span>
              </div>
            )}
          </>
        ) : (
          <p className="subject-card__meta subject-card__meta--empty">No classes listed yet</p>
        )}
      </div>
    </Link>
  );
};

export default SubjectCard;
