import React from 'react';
import { batchColor, DAYS, describeStart, formatTimeRange } from '../../utils/schedule';
import './courseBatches.css';

const byDay = (a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day);

// Lists each batch with its start date and weekly class times.
const CourseBatches = ({ batches = [], schedules = [], selectedBatchId, compact = false }) => (
  <ul className={`batch-list${compact ? ' batch-list--compact' : ''}`}>
    {batches.map((batch, index) => {
      const batchSchedules = schedules.filter((schedule) => schedule.batchId === batch._id).sort(byDay);
      const isSelected = selectedBatchId === batch._id;

      return (
        <li key={batch._id} className={`batch-list__item${isSelected ? ' is-selected' : ''}`}>
          <span className="batch-list__swatch" style={{ background: batchColor(index).accent }} aria-hidden="true" />
          <div>
            <p className="batch-list__name">
              {batch.batchName}
              {batch.courseTitle && <span>, {batch.courseTitle}</span>}
            </p>
            {batch.startDate && <p className="batch-list__start">{describeStart(batch.startDate)}</p>}
            {compact ? (
              batchSchedules.length === 0 && <p className="batch-list__pending">Class times not published yet</p>
            ) : batchSchedules.length > 0 ? (
              <ul className="batch-list__times">
                {batchSchedules.map((schedule) => (
                  <li key={schedule._id}>
                    <span>{schedule.day}</span>
                    <span>{formatTimeRange(schedule.startHour, schedule.duration)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="batch-list__pending">Class times not published yet</p>
            )}
          </div>
        </li>
      );
    })}
  </ul>
);

export default CourseBatches;
