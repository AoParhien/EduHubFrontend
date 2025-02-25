import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import FilterSidebar from '../filter-sidebar/filterSidebar';
import { Box, useBreakpointValue, Spinner } from '@chakra-ui/react';
import CourseCard from '../course-card/courseCard';
import './courses.css';
import debounce from 'lodash.debounce';

const Courses = () => {
    const { subcategory } = useParams();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [filters, setFilters] = useState({
        institute: 'Any',
        subject: 'Any',
        location: 'Any',
        fees: { min: 0, max: 15000 },
        board: [],
    });

    const buildQueryParams = (filters) => {
        const params = {};
        
        const trimAndLowercase = (value) => 
            typeof value === 'string' ? value.trim().toLowerCase() : value;
    
        if (filters.institute && filters.institute !== 'Any') 
            params.instituteName = filters.institute;
        if (filters.subject && filters.subject !== 'Any') 
            params.subject = trimAndLowercase(filters.subject);
        if (filters.location && filters.location !== 'Any') 
            params.location = trimAndLowercase(filters.location);
        if (filters.fees.min) 
            params.minFees = filters.fees.min;
        if (filters.fees.max) 
            params.maxFees = filters.fees.max;
        if (filters.board && Array.isArray(filters.board) && filters.board.length > 0) 
            params.board = filters.board;

        return new URLSearchParams(
            Object.entries(params).flatMap(([key, value]) => 
                Array.isArray(value) 
                    ? value.map(v => [key, v])
                    : [[key, value]]
            )
        ).toString();
    };

    const getCourses = useCallback(
        debounce(async (filters) => {
            setIsLoading(true);
            try {
                const query = buildQueryParams(filters);
                const apiUrl = process.env.REACT_APP_INSTITUTE_SERVICE_URL;
                const response = await fetch(`${apiUrl}/api/courses/getCourseListing?${query}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (subcategory) {
            setFilters(prev => ({
                ...prev,
                board: prev.board.length === 0 ? [subcategory.toLowerCase()] : prev.board
            }));
        }
    }, []);

    useEffect(() => {
        getCourses(filters);
    }, [filters, getCourses]);

    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));

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
                            className='eduhub__mobile-filter-button'
                        >
                            {isFilterOpen ? 'Close Filters' : 'Open Filters'}
                        </button>
                    </Box>
                )}

                {(!isMobile || isFilterOpen) && (
                    <FilterSidebar 
                        onFilterChange={handleFilterChange} 
                        initialFilters={filters}
                        width={isMobile ? '100%' : '300px'}
                        position={isMobile ? 'static' : 'sticky'}
                        top={isMobile ? 'auto' : '20px'}
                    />
                )}

                <div 
                    className='eduhub__courses-cards'
                    style={{ 
                        width: isMobile ? '100%' : 'calc(100% - 320px)', 
                        marginLeft: isMobile ? 0 : '20px' 
                    }}
                >
                    {isLoading ? (
                        <Box 
                            width="100%" 
                            textAlign="center" 
                            mt={10} 
                            display="flex" 
                            justifyContent="center"
                        >
                            <Spinner size="xl" color="blue.500" />
                        </Box>
                    ) : courses.length === 0 && !isLoading ? (
                        <Box width="100%" textAlign="center" color="gray.500" mt={10}>
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