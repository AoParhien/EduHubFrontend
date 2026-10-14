import React, { useState } from 'react';
import './instructorCard.css';

const initialsOf = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');

const InstructorCard = ({ teacherName, boards = [], image, description }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const showImage = image && !imageFailed;

    return (
        <article className="instructor-card">
            <div className="instructor-card__photo">
                {showImage ? (
                    <img src={image} alt="" loading="lazy" onError={() => setImageFailed(true)} />
                ) : (
                    <span className="instructor-card__initials" aria-hidden="true">{initialsOf(teacherName)}</span>
                )}
            </div>
            <div className="instructor-card__body">
                <h3>{teacherName || 'Teacher'}</h3>
                {description && <p className="instructor-card__description">{description}</p>}
                {boards.length > 0 && (
                    <p className="instructor-card__boards">{boards.join(', ')}</p>
                )}
            </div>
        </article>
    );
};

export default InstructorCard;
