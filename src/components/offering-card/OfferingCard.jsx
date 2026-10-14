import React from 'react';
import { Link } from 'react-router-dom';
import { formatRupees } from '../../utils/format';
import { describeStart } from '../../utils/schedule';
import { nextBatch, summarizeTimes } from '../../utils/offering';
import './OfferingCard.css';

const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

/*
 * One institute's class for a subject. `show` picks the leading identity:
 * "teacher" on subject pages, "subject" on teacher pages.
 */
const OfferingCard = ({ offering, show = 'teacher' }) => {
  const batch = nextBatch(offering.batches);
  const moreBatches = offering.batches.length - 1;

  return (
    <article className="offering">
      <div className="offering__who">
        {show === 'teacher' ? (
          <>
            {offering.teacher?.picture ? (
              <img src={offering.teacher.picture} alt="" className="offering__avatar" loading="lazy" />
            ) : (
              <span className="offering__avatar offering__avatar--empty" aria-hidden="true">{initials(offering.teacher?.name)}</span>
            )}
            <div className="offering__names">
              {offering.teacher ? (
                <Link to={`/teachers/${offering.teacher._id}`} className="offering__primary">{offering.teacher.name}</Link>
              ) : (
                <span className="offering__primary">Teacher to be announced</span>
              )}
              {offering.label && <span className="offering__label">{offering.label}</span>}
            </div>
          </>
        ) : (
          <div className="offering__names">
            <Link to={`/subjects/${offering.subject?.slug}`} className="offering__primary">{offering.subject?.title || offering.title}</Link>
            {offering.label && <span className="offering__label">{offering.label}</span>}
          </div>
        )}
      </div>

      <div className="offering__where">
        <Link to={`/institute/${offering.institute._id}`} className="offering__institute">
          {offering.institute.logoUrl && <img src={offering.institute.logoUrl} alt="" loading="lazy" />}
          <span>{offering.institute.name}</span>
        </Link>
        <span className="offering__area">{offering.institute.area || 'Karachi'}</span>
      </div>

      <div className="offering__when">
        {batch ? (
          <>
            <span>{summarizeTimes(batch.times)}</span>
            <span className="offering__muted">
              {describeStart(batch.startDate)}
              {moreBatches > 0 ? `, +${moreBatches} more ${moreBatches === 1 ? 'batch' : 'batches'}` : ''}
            </span>
          </>
        ) : (
          <span className="offering__muted">No batches open yet</span>
        )}
      </div>

      <div className="offering__fee">
        <strong>{formatRupees(offering.fees)}</strong>
        <span className="offering__muted">per month</span>
      </div>

      <Link to={`/course-details/${offering.courseId}`} className="offering__cta" aria-label={`View ${offering.title} at ${offering.institute.name}`}>
        View class
      </Link>
    </article>
  );
};

export default OfferingCard;
