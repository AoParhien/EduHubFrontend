import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import FilterSidebar from '../filter-sidebar/filterSidebar';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import CourseCard from '../course-card/courseCard';
import './courses.css';
import debounce from 'lodash.debounce';

const Courses = () => {
    const { subcategory } = useParams();
    const [courses, setCourses] = useState([]);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
                const response = await fetch(`http://localhost:3001/api/courses/getCourseListing?${query}`, {
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
        
        // Close filter sidebar on mobile after applying filters
        if (isMobile) {
            setIsFilterOpen(false);
        }
    };

    const toggleFilterSidebar = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <div className='eduhub__courses section__padding'>
            <Box 
                display="flex" 
                flexDirection={isMobile ? 'column' : 'row'}
                alignItems="flex-start"
                position="relative"
            >
                {/* Mobile Filter Toggle Button */}
                {isMobile && (
                    <Box 
                        width="100%" 
                        textAlign="center" 
                        mb={4} 
                        position="sticky" 
                        top="0" 
                        zIndex="10" 
                        bg="white"
                    >
                        <button 
                            onClick={toggleFilterSidebar}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#4A90E2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            {isFilterOpen ? 'Close Filters' : 'Open Filters'}
                        </button>
                    </Box>
                )}

                {/* Filter Sidebar (Responsive) */}
                {(!isMobile || isFilterOpen) && (
                    <FilterSidebar 
                        onFilterChange={handleFilterChange} 
                        initialFilters={filters}
                        width={isMobile ? '100%' : '300px'}
                        position={isMobile ? 'static' : 'sticky'}
                        top={isMobile ? 'auto' : '20px'}
                    />
                )}

                {/* Courses Cards */}
                <div 
                    className='eduhub__courses-cards'
                    style={{ 
                        width: isMobile ? '100%' : 'calc(100% - 320px)', 
                        marginLeft: isMobile ? 0 : '20px' 
                    }}
                >
                    {courses.length === 0 ? (
                        <Box 
                            width="100%" 
                            textAlign="center" 
                            color="gray.500" 
                            mt={10}
                        >
                            No courses found. Try adjusting your filters.
                        </Box>
                    ) : (
                        courses.map((course) => (
                            <CourseCard
                                key={course.courseId || course.title}
                                title={course.title}
                                fees={course.fees}
                                institute={course.instituteName}
                                board={course.board}
                                imageUrl={course.imageUrl}
                                id={course.courseId}
                            />
                        ))
                    )}
                </div>
            </Box>
        </div>
    );
};

export default Courses;