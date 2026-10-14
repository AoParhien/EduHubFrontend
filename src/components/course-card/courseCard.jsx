import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiUser } from 'react-icons/fi';
import { formatBoard, formatRupees } from '../../utils/format';
import './courseCard.css';

const CourseCard = ({ title, institute, teacherName, fees, board, imageUrl, id }) => (
  <Link to={`/course-details/${id}`} className="course-card">
    <div className="course-card__media">
      {imageUrl ? <img src={imageUrl} alt="" loading="lazy" /> : <div className="course-card__placeholder" />}
      {board && <span className="course-card__board">{formatBoard(board)}</span>}
    </div>
    <div className="course-card__body">
      <h3 className="course-card__title">{title}</h3>
      <ul className="course-card__meta">
        {institute && (
          <li>
            <FiMapPin aria-hidden="true" />
            <span>{institute}</span>
          </li>
        )}
        {teacherName && (
          <li>
            <FiUser aria-hidden="true" />
            <span>{teacherName}</span>
          </li>
        )}
      </ul>
      <div className="course-card__footer">
        <p className="course-card__fee">
          <strong>{formatRupees(fees)}</strong>
          <span> / month</span>
        </p>
        <span className="course-card__cta">View course</span>
      </div>
    </div>
  </Link>
);

export default CourseCard;
