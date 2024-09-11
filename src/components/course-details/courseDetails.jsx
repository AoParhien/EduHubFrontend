import React, { useEffect, useState } from 'react';
import { Box, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, Stack, Flex, Icon, Button, Divider } from '@chakra-ui/react';
import { BsCreditCard2Back, BsArrowRight } from 'react-icons/bs';
import { FaUser, FaClock } from 'react-icons/fa';
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
    // Add more courses here
];

const CourseDetails = () => {
    // const isMobile = useBreakpointValue({ base: true, md: false });
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    const getCourse = async () => {
        try {
            const response = await fetch(`https://localhost:3001/api/courses/getCourseDetails/66d1bc20ac4f5cd6f5d031aa`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setCourse(data)
            console.log(course)
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

    return (
        <Box className='section__padding' maxW="7xl" mx="auto" p={5} bg="white" boxShadow="md" borderRadius="lg">
            {/* Breadcrumb */}
            <Breadcrumb fontSize="sm" color="gray.500" separator=">">
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">O'Levels Mathematics By Ahmad Saya</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>

            <Flex flexDirection={{ base: 'column', md: 'row' }} mt={5}>
                <Stack flex="1" spacing={5}>
                    {/* Course Title Section */}
                    <Heading color="purple.700" size="lg">{course.title}</Heading>
                    <Box>
                        <Text fontSize="lg" fontWeight="bold">Course Details:</Text>
                        <Stack pl={4} mt={2} spacing={1} fontSize="md" color="gray.700">
                            <Text>• Instructor: {course.teacher.name}</Text>
                            <Text>• Board: {course.board}</Text>
                            <Text>• Duration: {course.durationMonths} months</Text>
                            <Text>• Class Format: {course.classFormat === 'InPerson' ? 'Onsite' : course.classFormat}</Text>
                        </Stack>
                    </Box>

                    {/* Icon Section */}
                    <Flex color="gray.600" fontSize="md" gap={5}>
                        <Flex align="center">
                            <Icon as={FaUser} boxSize={4} mr={2} />
                            <Text>Instructor: {course.teacher.name}</Text>
                        </Flex>
                        <Flex align="center">
                            <Icon as={FaClock} boxSize={4} mr={2} />
                            <Text>Duration: {course.durationMonths} months</Text>
                        </Flex>
                    </Flex>
                </Stack>


                {/* Fee Section */}
                <Flex ml="auto" mt="auto" justify="flex-end" >
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
                            <Text mr={2} mt={3} fontSize={15} >Fees: </Text>
                            <Text as="span" color="black.600" fontSize={28} fontWeight="bold">Rs.{course.fees}</Text>
                            {/* <Text mt={5} ml="auto" fontSize={15} textDecoration="line-through" color="gray.400">Rs.9,000</Text>
                                <Text ml={2} mt={5} fontSize={15} color="gray.400">50% off</Text> */}
                        </Flex>
                        <Divider my={4} />
                        <Button
                            color="white"
                            background="purple.300"
                            width="full"
                            rightIcon={<Icon as={BsArrowRight} boxSize={6} strokeWidth={0.3} mt={0.97} />}
                        >
                            Enroll Now
                        </Button>
                    </Box>
                </Flex >
            </Flex >


            {/* Tab Navigation */}
            <Tabs variant="unstyled" mt={5}>
                <TabList justifyContent="flex-start" bg="purple.600" pl={10} py={3}>
                    {['About', 'Schedule', 'Location', 'Fees Structure', 'Reviews'].map((tab) => (
                        <Tab key={tab} _selected={{ fontWeight: selectedFontWeight, color: 'white' }} _hover={{ color: 'whiteAlpha.800' }} color={'white'}>
                            <ScrollLink to={tab.toLowerCase().replace(' ', '')} smooth={true} duration={500}>{tab}</ScrollLink>
                        </Tab>
                    ))}
                </TabList>
            </Tabs>

            <Box pl={8} mt={8}>
                {/* About Section */}
                <Box id="about" py={4}>
                    <Heading as="h2" size="lg">About Instructor</Heading>
                    <Flex pt={5} gap={6} pr={150}>
                        <Image
                            src={`data:image/png;base64,${course.teacher.picture}`}
                            alt="Instructor Ahmad Saya"
                            boxSize="130px"
                            borderRadius="full"
                            objectFit="cover"
                        />
                        <Stack>
                            <Heading fontWeight={600} fontSize={20}>{course.teacher.name}</Heading>
                            <Text fontSize="md" color="gray.600">{course.teacher.description}</Text>
                        </Stack>
                    </Flex>
                </Box>

                <Box id="schedule" py={10}>
                    <Heading as="h2" size="lg">Class Schedule</Heading>
                    <Flex flexDirection={{ base: 'column', md: 'row' }}>
                        <Schedule batches={course.batches} schedules={course.schedules} />
                        <Stack ml={{ base: 0, md: 15 }} mt={{ base: 5, md: 0 }} spacing={5} width={{ base: '100%', md: '400px' }}>
                            <CourseBatches batches={course.batches} schedules={course.schedules} />
                        </Stack>
                    </Flex>
                </Box>



                {/* Location Section */}
                <Box id="location" py={10}>
                    <Heading as="h2" size="lg">Location</Heading>
                    <Text fontSize="lg" mb={8}>ASTC Bahadurabad</Text>
                    <OSMMap location={course.institute.location} />
                </Box>

                {/* Fees Section */}
                <Box id="feesstructure" py={10}>
                    <Heading as="h2" size="lg">Fees Structure</Heading>
                    <FeeTable />
                </Box>

                {/* Reviews Section */}
                <Box id="reviews" py={10}>
                    <Heading as="h2" size="lg">Similar Courses</Heading>
                    <CourseCarousel courses={courses} />
                </Box>
            </Box>
        </Box >
    );
};

export default CourseDetails;
