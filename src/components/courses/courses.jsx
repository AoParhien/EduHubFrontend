import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import FilterSidebar from '../filter-sidebar/filterSidebar';
import { Box, useBreakpointValue, Spinner, Button, Flex, Text } from '@chakra-ui/react';
import CourseCard from '../course-card/courseCard';
import './courses.css';
import debounce from 'lodash.debounce';

const Courses = () => {
    const { subcategory } = useParams();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCourses: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 8
    });

    const [filters, setFilters] = useState({
        institute: 'Any',
        subject: 'Any',
        fees: { min: 0, max: 15000 },
        board: [],
    });

    const buildQueryParams = (filters, page = 1) => {
        const params = {
            page,
            limit: pagination.limit
        };
        
        const trimAndLowercase = (value) => 
            typeof value === 'string' ? value.trim().toLowerCase() : value;
    
        if (filters.institute && filters.institute !== 'Any') 
            params.instituteName = filters.institute;
        if (filters.subject && filters.subject !== 'Any') 
            params.subject = trimAndLowercase(filters.subject);
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
        debounce(async (filters, page = 1) => {
            setIsLoading(true);
            try {
                const query = buildQueryParams(filters, page);
                const apiUrl = process.env.REACT_APP_INSTITUTE_SERVICE_URL;
                const response = await fetch(`${apiUrl}/api/courses/getCourseListing?${query}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setCourses(data.courses);
                setPagination(data.pagination);
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
        getCourses(filters, pagination.currentPage);
    }, [filters, pagination.currentPage, getCourses]);

    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const toggleFilterSidebar = () => {
        setIsFilterOpen(!isFilterOpen);
        if (!isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const closeFilterSidebar = () => {
        setIsFilterOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className={`eduhub__courses section__padding ${isFilterOpen && isMobile ? 'filter-open' : ''}`}>
            <Box 
                display="flex" 
                flexDirection={isMobile ? 'column' : 'row'}
                alignItems="flex-start"
                position="relative"
            >
                {!isMobile && (
                    <FilterSidebar 
                        onFilterChange={handleFilterChange} 
                        initialFilters={filters}
                        width="300px"
                        position="sticky"
                        top="20px"
                        isMobile={false}
                    />
                )}

                <div 
                    className='eduhub__courses-cards'
                    style={{ 
                        width: isMobile ? '100%' : 'calc(100% - 320px)', 
                        marginLeft: isMobile ? 0 : '20px' 
                    }}
                >
                    {isMobile && (
                        <Box 
                            className="eduhub__mobile-filter-button-container"
                            position="sticky"
                            top="0"
                            zIndex="10"
                            bg="white"
                            py={2}
                            px={1}
                            mb={3}
                            borderBottom="1px solid"
                            borderColor="gray.100"
                        >
                            <button 
                                onClick={toggleFilterSidebar}
                                className='eduhub__mobile-filter-button'
                            >
                                <span className="filter-icon">⚙️</span> Filter Courses
                            </button>
                        </Box>
                    )}

                    {isLoading ? (
                        <Box 
                            width="100%" 
                            textAlign="center" 
                            mt={10} 
                            display="flex" 
                            justifyContent="center"
                            className="eduhub__courses-empty-state"
                        >
                            <Spinner size="xl" color="blue.500" />
                        </Box>
                    ) : courses.length === 0 && !isLoading ? (
                        <Box 
                            width="100%" 
                            textAlign="center" 
                            color="gray.500" 
                            mt={10}
                            className="eduhub__courses-empty-state"
                        >
                            No courses found. Try adjusting your filters.
                        </Box>
                    ) : (
                        <>
                            {courses.map((course) => (
                                <CourseCard
                                    key={course.courseId || course.title}
                                    title={course.title}
                                    fees={course.fees}
                                    institute={course.instituteName}
                                    board={course.board}
                                    imageUrl={course.imageUrl}
                                    id={course.courseId}
                                />
                            ))}
                            
                            {/* Pagination Controls */}
                            <Flex 
                                justify="center" 
                                align="center" 
                                mt={6} 
                                mb={4} 
                                gap={4}
                                width="100%"
                            >
                                <Button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    isDisabled={!pagination.hasPrevPage}
                                    colorScheme="blue"
                                    variant="outline"
                                >
                                    Previous
                                </Button>
                                
                                <Text>
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </Text>
                                
                                <Button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    isDisabled={!pagination.hasNextPage}
                                    colorScheme="blue"
                                    variant="outline"
                                >
                                    Next
                                </Button>
                            </Flex>
                        </>
                    )}
                </div>
            </Box>

            {isMobile && isFilterOpen && (
                <>
                    <div className="eduhub__mobile-filter-overlay" onClick={closeFilterSidebar}></div>
                    <div className={`eduhub__mobile-filter-panel ${!isFilterOpen ? 'hidden' : ''}`}>
                        <FilterSidebar 
                            onFilterChange={handleFilterChange} 
                            initialFilters={filters}
                            isMobile={true}
                            onClose={closeFilterSidebar}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Courses;