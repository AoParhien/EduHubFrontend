import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import FilterSidebar from '../filter-sidebar/filterSidebar';
import { Box } from '@chakra-ui/react';
import CourseCard from '../course-card/courseCard';
import './courses.css';

const Courses = () => {
    const { subcategory } = useParams(); // Get the subcategory from URL params
    const [courses, setCourses] = useState([]); // State to store courses
    const [filters, setFilters] = useState({
        institute: 'Any',
        subject: 'Any',
        location: 'Any',
        fees: {
            min: 0,
            max: 15000,
        },
        board: subcategory || 'Any', // Initialize board filter with subcategory if it exists
    }); // Default filter values to ensure API call on initial load

    // Helper function to construct query string based on filters
    const buildQueryParams = (filters) => {
        const params = {};

        if (filters.institute && filters.institute !== 'Any') {
            params.instituteName = filters.institute;
        }
        if (filters.subject && filters.subject !== 'Any') {
            params.subject = filters.subject;
        }
        if (filters.location && filters.location !== 'Any') {
            params.location = filters.location;
        }
        if (filters.fees) {
            if (filters.fees.min) params.minFees = filters.fees.min;
            if (filters.fees.max) params.maxFees = filters.fees.max;
        }
        if (filters.board && filters.board !== 'Any') {
            params.board = filters.board; // Add board filter to query params
        }

        return new URLSearchParams(params).toString(); // Convert to query string
    };

    // Function to fetch courses with filters as URI parameters
    const getCourses = useCallback(async (filters) => {
        try {
            const query = buildQueryParams(filters);
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
    }, []);

    useEffect(() => {
        if (subcategory) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                board: subcategory,
            }));
        } else {
            setFilters((prevFilters) => ({
                ...prevFilters,
                board: 'Any', // Reset to 'Any' if no subcategory
            }));
        }
    }, [subcategory]);

    // Fetch courses when the component mounts or filters change
    useEffect(() => {
        getCourses(filters);
    }, [filters, getCourses]); // Include getCourses in the dependency array

    // Function to handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        })); // Update filters state with new filter values
    };
    return (
        <div className='eduhub__courses section__padding'>
            <Box display="flex" alignItems="flex-start">
                <FilterSidebar onFilterChange={handleFilterChange} /> {/* Pass callback to FilterSidebar */}
                <div className='eduhub__courses-cards'>
                    {courses.map((course, index) => (
                        <CourseCard
                            key={course.id || course.title}
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
