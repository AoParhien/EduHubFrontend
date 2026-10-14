import React, { useEffect, useState } from 'react';
import InstructorCard from '../instructor-card/instructorCard';
import { BACKEND_URL } from '../../utils/backendUrl';
import { formatBoard, normalizeBoard } from '../../utils/format';
import './instructorSection.css';

const MAX_TEACHERS = 6;

// Teachers often have the same board stored twice with different casing.
const uniqueBoards = (boards = []) => {
    const seen = new Set();
    return boards.filter((board) => {
        const key = normalizeBoard(board);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

const InstructorSection = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        fetch(`${BACKEND_URL}/api/teachers/getTopTeachers`, { signal: controller.signal })
            .then((response) => (response.ok ? response.json() : []))
            .then((data) => setTeachers(Array.isArray(data) ? data.slice(0, MAX_TEACHERS) : []))
            .catch(() => {});

        return () => controller.abort();
    }, []);

    // Hide the section rather than show an empty block.
    if (teachers.length === 0) {
        return null;
    }

    return (
        <section className="instructors page page-section" aria-labelledby="instructors-title">
            <div className="section-heading">
                <h2 id="instructors-title">Teachers on AoParhein</h2>
                <p>The teachers behind the classes you can book, from our partner institutes.</p>
            </div>
            <ul className="instructors__grid">
                {teachers.map((teacher, index) => (
                    <li key={`${teacher.name}-${index}`}>
                        <InstructorCard
                            teacherName={teacher.name}
                            boards={uniqueBoards(teacher.boards).map(formatBoard)}
                            image={teacher.picture}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default InstructorSection;
