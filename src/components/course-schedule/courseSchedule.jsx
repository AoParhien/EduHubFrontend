import React from 'react';
import './Timetable.css';

const Timetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    const classes = [
        { day: 'Monday', startTime: 9, duration: 1, name: 'Math', color: '#ff9999' },
        { day: 'Tuesday', startTime: 13, duration: 1.5, name: 'Physics', color: '#99ff99' },
        { day: 'Thursday', startTime: 10, duration: 2, name: 'Chemistry', color: '#9999ff' },
    ];

    const getGridRow = (day) => days.indexOf(day) + 2;
    const getGridColumn = (startTime, duration) => `${startTime - 7} / span ${duration}`;

    return (
        <div className="timetable">
            <div className="header">
                <div className="header-cell"></div>
                {hours.map(hour => (
                    <div key={hour} className="header-cell">{`${hour}:00`}</div>
                ))}
            </div>
            {days.map(day => (
                <div key={day} className="row">
                    <div className="day-cell">{day}</div>
                    {hours.map(hour => (
                        <div key={hour} className="time-cell"></div>
                    ))}
                </div>
            ))}
            {classes.map((cls, index) => (
                <div
                    key={index}
                    className="class"
                    style={{
                        gridRow: getGridRow(cls.day),
                        gridColumn: getGridColumn(cls.startTime, cls.duration),
                        backgroundColor: cls.color,
                    }}
                >
                    {cls.name}
                </div>
            ))}
        </div>
    );
};

export default Timetable;