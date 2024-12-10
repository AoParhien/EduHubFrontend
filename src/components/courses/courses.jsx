import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import FilterSidebar from '../filter-sidebar/filterSidebar';
import { Box } from '@chakra-ui/react';
import CourseCard from '../course-card/courseCard';
import './courses.css';
import debounce from 'lodash.debounce';

const Courses = () => {
    const { subcategory } = useParams();
    const [courses, setCourses] = useState([]);
    const [filters, setFilters] = useState({
        institute: 'Any',
        subject: 'Any',
        location: 'Any',
        fees: {
            min: 0,
            max: 15000,
        },
        board: subcategory || 'Any',
    });

    const buildQueryParams = (filters) => {
        const params = {};
        if (filters.institute && filters.institute !== 'Any') params.instituteName = filters.institute;
        if (filters.subject && filters.subject !== 'Any') params.subject = filters.subject;
        if (filters.location && filters.location !== 'Any') params.location = filters.location;
        if (filters.fees.min) params.minFees = filters.fees.min;
        if (filters.fees.max) params.maxFees = filters.fees.max;
        if (filters.board && filters.board !== 'Any') params.board = filters.board;
        return new URLSearchParams(params).toString();
    };

    const getCourses = useCallback(
        debounce(async (filters) => {
            try {
                const query = buildQueryParams(filters);
                const response = await fetch(`https://localhost:3001/api/courses/getCourseListing?${query}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setCourses(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        }, 300),
        []
    );

    useEffect(() => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            board: subcategory || 'Any',
        }));
    }, [subcategory]);

    useEffect(() => {
        getCourses(filters);
    }, [filters, getCourses]);

    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    return (
        <div className='eduhub__courses section__padding'>
            <Box display="flex" alignItems="flex-start">
                <FilterSidebar onFilterChange={handleFilterChange} initialFilters={filters} />
                <div className='eduhub__courses-cards'>
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id || course.title}
                            title={course.title}
                            fees={course.fees}
                            institute={course.instituteName}
                            board={course.board}
                            imageUrl={course.imageUrl}
                            id={course.courseId}
                        />
                    ))}
                </div>
            </Box>
        </div>
    );
};

export default Courses;
