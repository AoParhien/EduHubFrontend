import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
    Box, 
    Text, 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    Heading, 
    Stack, 
    Flex, 
    Icon, 
    Button, 
    Divider,
    VStack,
    useBreakpointValue,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure
} from '@chakra-ui/react';
import { BsCreditCard2Back, BsArrowRight, BsFilterRight } from 'react-icons/bs';
import { Tabs, TabList, Tab } from "@chakra-ui/react";
import { Link as ScrollLink } from "react-scroll";
import { Image } from '@chakra-ui/react';
import Schedule from '../schedule/schedule';
import OSMMap from '../map/map';
import FeeTable from '../fee-table/FeeTable';
import CourseCarousel from '../course-carousal/CourseCarousel';
import CenteredSpinner from '../centered-spinner/centeredSpinner';
import CourseBatches from '../course-batches/courseBatches';

const selectedFontWeight = 650;
const courses = [
    { id: 1, title: 'Course 1' },
    { id: 2, title: 'Course 2' },
    { id: 3, title: 'Course 3' },
];

const CourseDetails = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const { courseId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Responsive values
    const isMobile = useBreakpointValue({ base: true, md: false });
    const responsivePadding = useBreakpointValue({ base: 2, md: 5 });
    const responsiveHeadingSize = useBreakpointValue({ base: 'md', md: 'lg' });

    const getCourse = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/courses/getCourseDetails/${courseId}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setCourse(data)
        }
        catch (error) {
            console.error('Error fetching course data:', error);
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCourse();
    }, [])

    if (loading) {
        return <CenteredSpinner />
    }
    if (course === 'Internal server error') {
        return <div>No course data available.</div>;
    }

    // Mobile Tabs Drawer
    const MobileTabDrawer = () => (
        <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent borderTopRadius="lg">
                <DrawerCloseButton />
                <DrawerHeader>Course Sections</DrawerHeader>
                <DrawerBody>
                    <VStack spacing={4} align="stretch">
                        {['About', 'Schedule', 'Location', 'Fees Structure', 'Reviews'].map((tab) => (
                            <ScrollLink 
                                key={tab} 
                                to={tab.toLowerCase().replace(' ', '')} 
                                smooth={true} 
                                duration={500}
                                onClick={onClose}
                            >
                                <Button width="full" variant="ghost">
                                    {tab}
                                </Button>
                            </ScrollLink>
                        ))}
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );

    return (
        <Box 
            className='section__padding' 
            maxW="7xl" 
            mx="auto" 
            p={responsivePadding} 
            bg="white" 
            boxShadow={isMobile ? "none" : "md"} 
            borderRadius="lg"
        >
            {/* Breadcrumb with mobile adjustment */}
            <Breadcrumb 
                fontSize={isMobile ? "xs" : "sm"} 
                color="gray.500" 
                separator=">"
                mb={isMobile ? 2 : 0}
            >
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href={`/course-details/${courseId}`}>
                        {course.title}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            {/* Mobile Section Toggle */}
            {isMobile && (
                <Flex 
                    position="sticky" 
                    top="0" 
                    zIndex="10" 
                    justifyContent="flex-end" 
                    p={2}
                    width="100%"
                >
                    <Button 
                        leftIcon={<BsFilterRight />} 
                        variant="ghost"
                        onClick={onOpen}
                        color="gray.600"
                        width="auto"
                        p={1}
                    >
                        Sections
                    </Button>
                    <MobileTabDrawer />
                </Flex>
            )}
            {/* Course Header */}
            <Flex 
                flexDirection={{ base: 'column', md: 'row' }} 
                mt={isMobile ? 2 : 5}
                gap={isMobile ? 4 : 0}
            >
                <Stack flex="1" spacing={isMobile ? 3 : 5}>
                    <Heading 
                        color="#00308F" 
                        size={responsiveHeadingSize}
                        textAlign={isMobile ? 'left' : 'left'}
                    >
                        {course.title}
                    </Heading>

                    {/* Course Details */}
                    <Box>
                        <Text 
                            fontSize={isMobile ? 'md' : 'lg'} 
                            fontWeight="bold"
                            textAlign={isMobile ? 'left' : 'left'}
                        >
                            Course Details:
                        </Text>
                        <VStack 
                            pl={isMobile ? 0 : 4} 
                            mt={2} 
                            spacing={1} 
                            fontSize={isMobile ? 'sm' : 'md'} 
                            color="gray.700"
                            align={isMobile ? 'start' : 'start'}
                        >
                            <Text>• Instructor: {course.teacher.name}</Text>
                            <Text>• Board: {course.board}</Text>
                            <Text>• Duration: {course.durationMonths} months</Text>
                            <Text>• Class Format: {course.classFormat === 'InPerson' ? 'Onsite' : course.classFormat}</Text>
                        </VStack>
                    </Box>

                    {/* Fee Section - Mobile Friendly */}
                    <Box 
                        display={isMobile ? 'block' : 'none'}
                        border="1px"
                        borderColor="gray.300"
                        borderRadius="lg"
                        p={4}
                        textAlign="center"
                        width="100%"
                    >
                        <Flex justifyContent="center" alignItems="center">
                            <Icon as={BsCreditCard2Back} boxSize={5} mr={2} />
                            <Text mr={2} fontSize="md">Fees: </Text>
                            <Text fontSize="xl" fontWeight="bold" color="black.600">
                                Rs.{course.fees}
                            </Text>
                        </Flex>
                        <Divider my={3} />
                        <Link to="/checkout" state={{ course: course }}>
                            <Button
                                color="white"
                                background="#00308F"
                                width="full"
                                size="md"
                                rightIcon={<BsArrowRight />}
                            >
                                Enroll Now
                            </Button>
                        </Link>
                    </Box>
                </Stack>

                {/* Desktop Fee Section */}
                {!isMobile && (
                    <Flex ml="auto" mt="auto" justify="flex-end">
                        <Box
                            border="1px"
                            borderColor="gray.300"
                            borderRadius="lg"
                            p={5}
                            width="350px"
                            height="150px"
                            textAlign="center"
                        >
                            <Flex alignContent="center">
                                <Icon as={BsCreditCard2Back} boxSize={5} mr={2} mt={3} />
                                <Text mr={2} mt={3} fontSize={15}>Fees: </Text>
                                <Text as="span" color="black.600" fontSize={28} fontWeight="bold">
                                    Rs.{course.fees}
                                </Text>
                            </Flex>
                            <Divider my={4} />
                            <Link to="/checkout" state={{ course: course }}>
                                <Button
                                    color="white"
                                    background="#00308F"
                                    width="full"
                                    rightIcon={<BsArrowRight />}
                                >
                                    Enroll Now
                                </Button>
                            </Link>
                        </Box>
                    </Flex>
                )}
            </Flex>

            {/* Desktop Tab Navigation */}
            {!isMobile && (
                <Tabs variant="unstyled" mt={5}>
                    <TabList justifyContent="flex-start" bg="#00308F" pl={10} py={3}>
                        {['About', 'Schedule', 'Location', 'Fees Structure', 'Reviews'].map((tab) => (
                            <Tab 
                                key={tab} 
                                _selected={{ fontWeight: selectedFontWeight, color: 'white' }} 
                                _hover={{ color: 'whiteAlpha.800' }} 
                                color={'white'}
                            >
                                <ScrollLink to={tab.toLowerCase().replace(' ', '')} smooth={true} duration={500}>
                                    {tab}
                                </ScrollLink>
                            </Tab>
                        ))}
                    </TabList>
                </Tabs>
            )}

            {/* Sections Content */}
            <Box pl={isMobile ? 0 : 8} mt={isMobile ? 4 : 8}>
                {/* About Section */}
                <Box id="about" py={4}>
                    <Heading as="h2" size={responsiveHeadingSize} textAlign={isMobile ? 'left' : 'left'}>
                        About Instructor
                    </Heading>
                    <Flex 
                        pt={5} 
                        gap={isMobile ? 6 : 6} 
                        flexDirection={isMobile ? 'row' : 'row'}
                        alignItems="left"
                        pr={isMobile ? 0 : 150}
                    >
                        <Image
                            src={course.teacher.picture}
                            alt="Instructor"
                            boxSize={isMobile ? "100px" : "130px"}
                            borderRadius="full"
                            objectFit="cover"
                        />
                        <VStack align={isMobile ? 'center' : 'start'}>
                            <Heading fontWeight={600} fontSize={isMobile ? 'lg' : 20}>
                                {course.teacher.name}
                            </Heading>
                            <Text 
                                fontSize={isMobile ? 'sm' : 'md'} 
                                color="gray.600" 
                                textAlign={isMobile ? 'center' : 'left'}
                            >
                                {course.teacher.description}
                            </Text>
                        </VStack>
                    </Flex>
                </Box>

                {/* Schedule Section */}
                <Box id="schedule" py={10}>
                    <Heading 
                        as="h2" 
                        size={responsiveHeadingSize} 
                        textAlign={isMobile ? 'center' : 'left'}
                    >
                        Class Schedule
                    </Heading>
                    <Flex 
                        flexDirection={{ base: 'column', md: 'row' }}
                        gap={isMobile ? 4 : 0}
                    >
                        <Box width={isMobile ? '100%' : 'auto'}>
                            <Schedule 
                                batches={course.batches} 
                                schedules={course.schedules} 
                            />
                        </Box>
                        <VStack 
                            ml={{ base: 0, md: 15 }} 
                            mt={{ base: 5, md: 0 }} 
                            spacing={5} 
                            width={{ base: '100%', md: '400px' }}
                        >
                            <CourseBatches 
                                batches={course.batches} 
                                schedules={course.schedules} 
                            />
                        </VStack>
                    </Flex>
                </Box>

                {/* Location Section */}
                <Box id="location" py={10}>
                    <Heading 
                        as="h2" 
                        size={responsiveHeadingSize} 
                        textAlign={isMobile ? 'center' : 'left'}
                    >
                        Location
                    </Heading>
                    <Text 
                        fontSize={isMobile ? 'md' : 'lg'} 
                        mb={8} 
                        textAlign={isMobile ? 'center' : 'left'}
                    >
                        ASTC Bahadurabad
                    </Text>
                    <Box width="100%" height={isMobile ? '250px' : '400px'}>
                        <OSMMap location={course.institute.location} />
                    </Box>
                </Box>

                {/* Fees Structure Section */}
                <Box id="feesstructure" py={10} mt={isMobile ? 60 : 0}>
                    <Heading 
                        as="h2" 
                        size={responsiveHeadingSize} 
                        textAlign={isMobile ? 'center' : 'left'}
                    >
                        Fees Structure
                    </Heading>
                    <Box 
                        width="100%" 
                        overflowX={isMobile ? 'auto' : 'visible'}
                        sx={{
                            '& table': {
                                width: '100%',
                                ...(isMobile && {
                                    fontSize: 'xs',
                                    '& th, & td': {
                                        padding: '8px 10px',
                                        fontSize: '12px',
                                    }
                                })
                            }
                        }}
                    >
                        <FeeTable 
                            registrationFees={course.institute.registrationFees} 
                            courseFees={course.fees} 
                        />
                    </Box>
                </Box>
                {/* Reviews Section */}
                <Box id="reviews" py={10}>
                    <Heading 
                        as="h2" 
                        size={responsiveHeadingSize} 
                        textAlign={isMobile ? 'center' : 'left'}
                    >
                        Similar Courses
                    </Heading>
                    <CourseCarousel courses={courses} />
                </Box>
            </Box>
        </Box>
    );
};

export default CourseDetails