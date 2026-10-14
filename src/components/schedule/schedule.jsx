import React from 'react';
import { batchColor, DAYS, formatTime, formatTimeRange, startOffset } from '../../utils/schedule';
import './schedule.css';

const MIN_SLOT_WIDTH = 88;
const LANE_HEIGHT = 48;

// Gives overlapping classes on the same day separate lanes so none are hidden.
const assignLanes = (entries) => {
    const laneEnds = [];
    return [...entries]
        .sort((a, b) => a.start - b.start)
        .map((entry) => {
            let lane = laneEnds.findIndex((end) => end <= entry.start);
            if (lane === -1) lane = laneEnds.length;
            laneEnds[lane] = entry.start + entry.duration;
            return { ...entry, lane };
        });
};

/*
 * Weekly timetable. Rows are days, columns are hours; only the hours that
 * actually have classes (plus one either side) are shown.
 */
const Schedule = ({ batches = [], schedules = [] }) => {
    const colorFor = new Map(batches.map((batch, index) => [batch._id, batchColor(index)]));
    const nameFor = new Map(batches.map((batch) => [batch._id, batch.courseTitle ? `${batch.courseTitle}, ${batch.batchName}` : batch.batchName]));

    const classes = schedules
        .filter((schedule) => colorFor.has(schedule.batchId))
        .map((schedule) => ({
            id: schedule._id,
            day: schedule.day,
            start: startOffset(schedule.startHour),
            duration: Number(schedule.duration) || 1,
            label: nameFor.get(schedule.batchId),
            time: formatTimeRange(schedule.startHour, schedule.duration),
            color: colorFor.get(schedule.batchId),
        }))
        .filter((entry) => !Number.isNaN(entry.start));

    if (classes.length === 0) {
        return (
            <div className="schedule-empty">
                Class times haven't been published for this course yet. The institute will share them before your first class.
            </div>
        );
    }

    const firstHour = Math.max(0, Math.floor(Math.min(...classes.map((c) => c.start))) - 1);
    const lastHour = Math.min(12, Math.ceil(Math.max(...classes.map((c) => c.start + c.duration))) + 1);
    const hours = Array.from({ length: lastHour - firstHour }, (_, i) => firstHour + i);
    const pct = (value) => `${(value / hours.length) * 100}%`;

    return (
        <div className="schedule" role="region" aria-label="Weekly timetable" tabIndex={0}>
            <div className="schedule__grid" style={{ minWidth: hours.length * MIN_SLOT_WIDTH + 112 }}>
                <div className="schedule__corner" />
                <div className="schedule__hours">
                    {hours.map((hour) => (
                        <span key={hour}>{formatTime(hour)}</span>
                    ))}
                </div>

                {DAYS.map((day) => {
                    const dayClasses = assignLanes(classes.filter((entry) => entry.day === day));
                    const lanes = Math.max(1, ...dayClasses.map((entry) => entry.lane + 1));
                    const rowHeight = lanes * LANE_HEIGHT + 8;
                    return (
                        <React.Fragment key={day}>
                            <div className={`schedule__day${dayClasses.length ? ' has-classes' : ''}`} style={{ height: rowHeight }}>{day.slice(0, 3)}</div>
                            <div className="schedule__track" style={{ height: rowHeight, backgroundSize: `${pct(1)} 100%` }}>
                                {dayClasses.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="schedule__class"
                                        style={{
                                            top: entry.lane * LANE_HEIGHT + 4,
                                            height: LANE_HEIGHT - 4,
                                            left: `calc(${pct(entry.start - firstHour)} + 3px)`,
                                            width: `calc(${pct(entry.duration)} - 6px)`,
                                            background: entry.color.fill,
                                            borderLeftColor: entry.color.accent,
                                        }}
                                        title={`${entry.label}, ${day} ${entry.time}`}
                                    >
                                        <strong>{entry.label}</strong>
                                        <span>{entry.time}</span>
                                    </div>
                                ))}
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default Schedule;
