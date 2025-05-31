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

    // Debug effect to monitor state changes
    useEffect(() => {
        console.log('🔍 COURSES STATE:', courses);
        console.log('🔍 COURSES LENGTH:', courses.length);
        console.log('🔍 IS LOADING:', isLoading);
    }, [courses, isLoading]);

    const buildQueryParams = useCallback((filters, page = 1, limit = 8) => {
        const params = {
            page,
            limit
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
    }, []);

    const getCourses = useCallback(async (filters, page = 1) => {
        setIsLoading(true);
        console.log('🚀 API CALL STARTED - Page:', page, 'Filters:', filters);
        
        try {
            const query = buildQueryParams(filters, page, 8);
            const apiUrl = process.env.REACT_APP_INSTITUTE_SERVICE_URL;
            
            console.log('📡 API URL:', apiUrl);
            console.log('📡 Query:', query);
            
            if (!apiUrl) {
                throw new Error('API URL not configured');
            }
            
            const fullUrl = `${apiUrl}/api/courses/getCourseListing?${query}`;
            console.log('📡 FULL URL:', fullUrl);
            
            const response = await fetch(fullUrl, {
                method: 'GET',
                credentials: 'include',
            });
            
            console.log('📡 Response Status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📡 RAW API RESPONSE:', data);
            console.log('📡 data.courses exists?', !!data.courses);
            console.log('📡 data.courses type:', typeof data.courses);
            console.log('📡 data.courses length:', data.courses?.length);
            
            // Ensure courses is always an array
            const coursesArray = Array.isArray(data.courses) ? data.courses : [];
            console.log('📡 Setting courses to:', coursesArray);
            
            setCourses(coursesArray);
            
            // Set pagination with fallback
            const paginationData = data.pagination || {
                currentPage: page,
                totalPages: 1,
                totalCourses: coursesArray.length,
                hasNextPage: false,
                hasPrevPage: false,
                limit: 8
            };
            
            console.log('📡 Setting pagination to:', paginationData);
            setPagination(paginationData);
            
        } catch (error) {
            console.error('❌ API ERROR:', error);
            setCourses([]);
            setPagination({
                currentPage: page,
                totalPages: 1,
                totalCourses: 0,
                hasNextPage: false,
                hasPrevPage: false,
                limit: 8
            });
        } finally {
            setIsLoading(false);
            console.log('🏁 API CALL COMPLETED');
        }
    }, [buildQueryParams]);

    // Debounced version for filter changes
    const debouncedGetCourses = useCallback(
        debounce((filters, page) => {
            getCourses(filters, page);
        }, 300),
        [getCourses]
    );

    // Handle subcategory initialization
    useEffect(() => {
        if (subcategory) {
            console.log('🏷️ Setting subcategory filter:', subcategory);
            setFilters(prev => ({
                ...prev,
                board: prev.board.length === 0 ? [subcategory.toLowerCase()] : prev.board
            }));
        }
    }, [subcategory]);

    // Main effect for filter changes
    useEffect(() => {
        console.log('🔄 Filters changed, fetching courses...');
        debouncedGetCourses(filters, 1);
        // Reset pagination when filters change
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, [filters, debouncedGetCourses]);

    const handleFilterChange = (newFilters) => {
        console.log('🎛️ Filter change:', newFilters);
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    const handlePageChange = (newPage) => {
        console.log('📄 Page change to:', newPage);
        if (newPage !== pagination.currentPage && newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
            // Call API directly for pagination (no debounce needed)
            getCourses(filters, newPage);
        }
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

    // Debug render logic
    console.log('🎨 RENDER - courses.length:', courses.length, 'isLoading:', isLoading);

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
                    ) : courses.length === 0 ? (
                        <Box 
                            width="100%" 
                            textAlign="center" 
                            color="gray.500" 
                            mt={10}
                            className="eduhub__courses-empty-state"
                        >
                            <Text>No courses found. Try adjusting your filters.</Text>
                            <Text fontSize="sm" mt={2} color="gray.400">
                                Debug: Check browser console for detailed logs
                            </Text>
                        </Box>
                    ) : (
                        <>
                            <Text fontSize="sm" color="gray.500" mb={4}>
                                Found {courses.length} courses
                            </Text>
                            {courses.map((course, index) => (
                                <CourseCard
                                    key={course.courseId || course.title || index}
                                    title={course.title}
                                    fees={course.fees}
                                    institute={course.instituteName}
                                    board={course.board}
                                    imageUrl={course.imageUrl}
                                    id={course.courseId}
                                />
                            ))}
                            
                            {/* Pagination Controls */}
                            {pagination && pagination.totalPages > 1 && (
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
                                        isDisabled={!pagination.hasPrevPage || pagination.currentPage <= 1}
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
                                        isDisabled={!pagination.hasNextPage || pagination.currentPage >= pagination.totalPages}
                                        colorScheme="blue"
                                        variant="outline"
                                    >
                                        Next
                                    </Button>
                                </Flex>
                            )}
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