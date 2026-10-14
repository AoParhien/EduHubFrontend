import React, { useState, useEffect } from 'react';
import './instructorSection.css';
import InstructorCard from '../instructor-card/instructorCard';
import { px } from 'framer-motion';
import { BACKEND_URL } from '../../utils/backendUrl';

const InstructorSection = () => {
    const [topTeachers, setTopTeachers] = useState([]);

    // Fetch top teachers from the API
    const getCourses = async () => {
        try {
            const apiUrl = BACKEND_URL;
            const response = await fetch(`${apiUrl}/api/teachers/getTopTeachers`, {
                method: 'GET',
                credentials: 'include', // Include credentials if required
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Expand data to ensure a consistent number of cards (6)
            const expandedData = Array.from({ length: 6 }, (_, i) => data[i % data.length]);

            setTopTeachers(expandedData);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        getCourses();
    }, []);

    return (
        <div className="eduhub__instructor-section section__padding">
            <div className="eduhub__instructor-section-content">
                <h1>Best Instructors Onboard</h1>
                <p>
                    At AoParhein, we strive to bring together the best
                    <br />
                    professors for the best courses
                </p>
            </div>
            <div className="eduhub__instructor-section-instructors">
                {topTeachers.map((teacher, index) => (
                    <InstructorCard
                        key={teacher?.id || index} // Use teacher ID if available, fallback to index
                        teacherName={teacher?.name || 'Unknown Instructor'}
                        board={teacher?.boards?.[0] || 'N/A'} // Safely access boards or fallback to 'N/A'
                        image={teacher?.picture || 'defaultImagePath'} // Provide a default image if not available
                    />
                ))}
            </div>
        </div>
    );
};

export default InstructorSection;
