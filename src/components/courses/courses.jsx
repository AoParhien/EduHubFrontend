import React, { useState, useEffect } from 'react';
import FilterSidebar from '../filter-sidebar/filterSidebar';
import { Box } from '@chakra-ui/react';
import CourseCard from '../course-card/courseCard';
import './courses.css';

const Courses = () => {
    const [courses, setCourses] = useState([]); // State to store courses
    const [filters, setFilters] = useState({}); // State to store filters

    // Function to fetch courses with filters as URI parameters
    const getCourses = async (filters) => {
        try {
            // Construct query string from filters
            const query = new URLSearchParams(filters).toString();
            const response = await fetch(`https://localhost:3001/api/courses/getCourseListing?${query}`, {
                method: 'GET',
                credentials: 'include', // Include credentials if required
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCourses(data); // Store fetched data in state
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    // Fetch courses when the component mounts or filters change
    useEffect(() => {
        getCourses(filters);
    }, [filters]); // Re-run when filters change

    // Function to handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters); // Update filter state
    };

    return (
        <div className='eduhub__courses section__padding'>
            <Box display="flex" alignItems="flex-start">
                <FilterSidebar onFilterChange={handleFilterChange} /> {/* Pass callback to FilterSidebar */}
                <div className='eduhub__courses-cards'>
                    {courses.map((course, index) => (
                        <CourseCard
                            key={index}
                            title={course.title}
                            fees={course.fees}
                            institute={course.instituteName}
                            board={course.board}
                            image={`data:image/png;base64,${course.image}`} // Passing image as prop
                        />
                    ))}
                </div>
            </Box>
        </div>
    );
};

export default Courses;
