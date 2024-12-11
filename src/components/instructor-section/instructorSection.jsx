import React, { useState, useEffect } from 'react'
import './instructorSection.css'
import InstructorCard from '../instructor-card/instructorCard'

const InstructorSection = () => {
    const [topTeachers, setTopTeachers] = useState([]);
    const getCourses = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/teachers/getTopTeachers', {
                method: 'GET',
                credentials: 'include', // Include credentials if required
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const expandedData = Array(6).fill(data[0]);

            setTopTeachers(expandedData); // Store fetched data in state
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    // Fetch courses when the component mounts
    useEffect(() => {
        getCourses();
    }, []);



    return (
        <div className='eduhub__instructor-section section__padding'>
            <div className='eduhub__instructor-section-content'>
                <h1>
                    Best Instructors Onboard
                </h1>
                <p>At the Academy, we strive to bring together the best<br /> professors for the best courses</p>
            </div>
            <div className='eduhub__instructor-section-instructors'>
                {topTeachers.map((teacher, index) => (
                    <InstructorCard
                        key={index} // Add a unique key, e.g., teacher ID if available
                        teacherName={teacher?.name}
                        board={teacher?.boards.length > 0 ? teacher?.boards[0] : 'N/A'} // Safely access the first board or show 'N/A' if not available
                        image={teacher?.picture} // Correctly format Base64 image data
                    />

                ))}
            </div>

        </div>
    )
}

export default InstructorSection
