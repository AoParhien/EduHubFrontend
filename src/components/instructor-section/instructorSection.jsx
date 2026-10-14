import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import InstructorCard from '../instructor-card/instructorCard';
import { BACKEND_URL } from '../../utils/backendUrl';
import './instructorSection.css';

const MAX_TEACHERS = 6;

const InstructorSection = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        fetch(`${BACKEND_URL}/api/catalog/teachers`, { signal: controller.signal })
            .then((response) => (response.ok ? response.json() : []))
            .then((data) => setTeachers(Array.isArray(data) ? data.slice(0, MAX_TEACHERS) : []))
            .catch(() => {});
        return () => controller.abort();
    }, []);

    // Hide the section rather than show an empty block.
    if (teachers.length === 0) return null;

    return (
        <section className="instructors page page-section" aria-labelledby="instructors-title">
            <div className="section-heading">
                <h2 id="instructors-title">Teachers on AoParhein</h2>
                <p>Many teach at more than one institute. Open a profile to see all their classes and timings in one place.</p>
            </div>
            <ul className="instructors__grid">
                {teachers.map((teacher) => (
                    <li key={teacher._id}>
                        <InstructorCard
                            teacherName={teacher.name}
                            boards={teacher.subjects.slice(0, 2)}
                            image={teacher.picture}
                            to={`/teachers/${teacher._id}`}
                        />
                    </li>
                ))}
            </ul>
            <Button as={RouterLink} to="/teachers" variant="outline" mt={8}>See all teachers</Button>
        </section>
    );
};

export default InstructorSection;
