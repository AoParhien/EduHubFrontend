import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import FilterSidebar from '../filter-sidebar/filterSidebar';
import { Box, useBreakpointValue, Spinner, Button, Flex, Text, Alert, AlertIcon, Badge, Stack } from '@chakra-ui/react';
import CourseCard from '../course-card/courseCard';
import './courses.css';
import debounce from 'lodash.debounce';

const Courses = () => {
    const { subcategory } = useParams();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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
        
        try {
            const query = buildQueryParams(filters, page, 8);
            const apiUrl = process.env.REACT_APP_INSTITUTE_SERVICE_URL;
            
            if (!apiUrl) {
                throw new Error('API URL not configured');
            }
            
            const fullUrl = `${apiUrl}/api/courses/getCourseListing?${query}`;
            
            const response = await fetch(fullUrl, {
                method: 'GET',
                credentials: 'include',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Ensure courses is always an array
            const coursesArray = Array.isArray(data.courses) ? data.courses : [];
            
            setCourses(coursesArray);
            setErrorMessage('');
            
            // Set pagination with fallback
            const paginationData = data.pagination || {
                currentPage: page,
                totalPages: 1,
                totalCourses: coursesArray.length,
                hasNextPage: false,
                hasPrevPage: false,
                limit: 8
            };
            
            setPagination(paginationData);
            
        } catch (error) {
            setCourses([]);
            setErrorMessage('We could not load courses right now. Please retry in a moment.');
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
            setFilters(prev => ({
                ...prev,
                board: prev.board.length === 0 ? [subcategory.toLowerCase()] : prev.board
            }));
        }
    }, [subcategory]);

    // Main effect for filter changes
    useEffect(() => {
        debouncedGetCourses(filters, 1);
        // Reset pagination when filters change
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, [filters, debouncedGetCourses]);

    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    const handlePageChange = (newPage) => {
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

    const activeFilterCount = [
        filters.institute !== 'Any',
        filters.subject !== 'Any',
        Array.isArray(filters.board) && filters.board.length > 0,
        Number(filters.fees.max) < 15000,
    ].filter(Boolean).length;

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
                    <Box
                        className="eduhub__courses-toolbar"
                        bg="linear-gradient(135deg, #ffffff 0%, #f7fbff 100%)"
                        borderWidth="1px"
                        borderColor="blue.100"
                        borderRadius="28px"
                        boxShadow="0 18px 40px -34px rgba(13, 59, 102, 0.32)"
                        px={{ base: 4, md: 6 }}
                        py={{ base: 4, md: 5 }}
                        mb={5}
                        width="100%"
                    >
                        <Flex
                            justify="space-between"
                            align={{ base: 'flex-start', lg: 'center' }}
                            direction={{ base: 'column', lg: 'row' }}
                            gap={4}
                        >
                            <Box>
                                <Text
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    letterSpacing="0.18em"
                                    color="blue.700"
                                    fontWeight="800"
                                    mb={1}
                                >
                                    Course Catalogue
                                </Text>
                                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800" color="gray.800" lineHeight="1.1">
                                    Discover courses that match your goals
                                </Text>
                                <Text mt={2} color="gray.600" maxW="680px">
                                    Compare institutes, subjects, boards, and monthly fees from a cleaner catalog experience.
                                </Text>
                            </Box>
                            <Stack direction={{ base: 'row', md: 'row' }} spacing={3} flexWrap="wrap">
                                <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={3} py={1.5}>
                                    {courses.length} results
                                </Badge>
                                <Badge colorScheme="gray" variant="subtle" borderRadius="full" px={3} py={1.5}>
                                    {activeFilterCount} active filters
                                </Badge>
                            </Stack>
                        </Flex>
                    </Box>

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
                        >
                            <button 
                                onClick={toggleFilterSidebar}
                                className='eduhub__mobile-filter-button'
                            >
                                <span className="filter-icon">⚙️</span>
                                <span>Refine Results</span>
                                <span className="filter-chip">{activeFilterCount}</span>
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
                    ) : errorMessage ? (
                        <Box width="100%" mt={6}>
                            <Alert status="error" borderRadius="xl" flexDirection="column" alignItems="flex-start" gap={3}>
                                <Flex width="100%" justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={3}>
                                    <Flex align="center" gap={2}>
                                        <AlertIcon />
                                        <Text>{errorMessage}</Text>
                                    </Flex>
                                    <Button colorScheme="red" variant="outline" onClick={() => getCourses(filters, pagination.currentPage)}>
                                        Retry
                                    </Button>
                                </Flex>
                            </Alert>
                        </Box>
                    ) : courses.length === 0 ? (
                        <Box 
                            width="100%" 
                            textAlign="center" 
                            color="gray.500" 
                            mt={10}
                            bg="white"
                            borderWidth="1px"
                            borderColor="blue.100"
                            borderRadius="28px"
                            py={10}
                            px={6}
                            className="eduhub__courses-empty-state"
                        >
                            <Text fontSize="2xl" fontWeight="800" color="gray.800" mb={2}>
                                No courses match these filters
                            </Text>
                            <Text mb={5}>Try widening your fee range, changing the board, or clearing a few filters.</Text>
                            <Button colorScheme="blue" variant="outline" onClick={() => setFilters({
                                institute: 'Any',
                                subject: 'Any',
                                fees: { min: 0, max: 15000 },
                                board: [],
                            })}>
                                Clear filters
                            </Button>
                        </Box>
                    ) : (
                        <>
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
                                    bg="white"
                                    borderWidth="1px"
                                    borderColor="blue.100"
                                    borderRadius="24px"
                                    px={4}
                                    py={4}
                                >
                                    <Button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        isDisabled={!pagination.hasPrevPage || pagination.currentPage <= 1}
                                        colorScheme="blue"
                                        variant="outline"
                                    >
                                        Previous
                                    </Button>
                                    
                                    <Text fontWeight="700" color="gray.700">
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
