import React from 'react';
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
// import MapComponent from '../map/hereMap';
// import MapboxMap from '../map/mapBox';
// import HereMap from '../map/hereMap';


const selectedFontWeight = 650
const courses = [
    { id: 1, title: 'Course 1' },
    { id: 2, title: 'Course 2' },
    { id: 3, title: 'Course 3' },
    { id: 4, title: 'Course 3' },
    { id: 5, title: 'Course 3' },
    { id: 6, title: 'Course 3' },

    // Add more courses here
];
const CourseDetails = () => {
    return (
        <div className='section__padding'>
            <Box maxW="7xl" mx="auto" p={5}>
                {/* Breadcrumb */}
                <Breadcrumb fontSize="sm" color="black" separator=">" fontWeight="500">
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

                <Flex>
                    <Stack>
                        {/* Course Title Section */}
                        <Stack spacing={3} mt={5}>
                            <Text color="black.500" fontWeight="bold" textDecoration="underline">ASTC</Text>
                            <Heading size="xl">O'Levels Mathematics By Ahmad Saya</Heading>
                            <Box mt={3}>
                                <Text fontSize="lg" fontWeight="bold">Course Details:</Text>
                                <Stack pl={4} mt={2} spacing={1} fontSize="md" color="gray.700">
                                    <Text>• Instructor: Ahmad Saya</Text>
                                    <Text>• Level: O Levels</Text>
                                    <Text>• Start Date: 24th August</Text>
                                    <Text>• Duration: [Specify duration, e.g., 3 months]</Text>
                                    <Text>• Class Format: [In-person/Online/Hybrid]</Text>
                                </Stack>
                            </Box>
                        </Stack>

                        {/* Icon Section */}
                        <Flex mt={5} align="center" color="gray.600" fontSize={15} flexWrap="wrap">
                            <Flex align="center" mr={5}>
                                <Icon as={FaUser} boxSize={4} mr={1} />
                                <Text>Instructor: Ahmad Saya</Text>
                            </Flex>
                            <Flex align="center" mr={5}>
                                <Icon as={FaClock} boxSize={4} mr={1} />
                                <Text>Duration: 9 months</Text>
                            </Flex>
                            <Flex align="center" mr={5}>
                                <Icon as={FaUser} boxSize={4} mr={1} />
                                <Text>Branch: ASTC Gulshan & Bahadurabad</Text>
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
                            <Flex>
                                <Icon as={BsCreditCard2Back} boxSize={5} mr={2} mt={3} />
                                <Text mr={2} mt={3} fontSize={15} >Fees: </Text>
                                <Text as="span" color="black.600" fontSize={28} fontWeight="bold">Rs.4,500</Text>
                                <Text mt={5} ml="auto" fontSize={15} textDecoration="line-through" color="gray.400">Rs.9,000</Text>
                                <Text ml={2} mt={5} fontSize={15} color="gray.400">50% off</Text>
                            </Flex>
                            <Divider my={4} />
                            <Button
                                color="white"
                                background="#362AC1"
                                width="full"
                                rightIcon={<Icon as={BsArrowRight} boxSize={6} strokeWidth={0.3} mt={0.97} />}
                            >
                                Enroll Now
                            </Button>
                        </Box>
                    </Flex >
                </Flex >
            </Box >
            {/* Tab Navigation */}
            <Tabs variant="unstyled" mt={5} mb={5} >
                <TabList justifyContent="left" bg="#362AC1" color="white" pl={10} py={5}>
                    <Tab _selected={{ fontWeight: selectedFontWeight }}>
                        <ScrollLink to="about" smooth={true} duration={500}>About</ScrollLink>
                    </Tab>
                    <Tab _selected={{ fontWeight: selectedFontWeight }}>
                        <ScrollLink to="schedule" smooth={true} duration={500}>Schedule</ScrollLink>
                    </Tab>
                    <Tab _selected={{ fontWeight: selectedFontWeight }}>
                        <ScrollLink to="location" smooth={true} duration={500}>Location</ScrollLink>
                    </Tab>
                    <Tab _selected={{ fontWeight: selectedFontWeight }}>
                        <ScrollLink to="fees" smooth={true} duration={500}>Fees Structure</ScrollLink>
                    </Tab>
                    <Tab _selected={{ fontWeight: selectedFontWeight }}>
                        <ScrollLink to="reviews" smooth={true} duration={500}>Reviews</ScrollLink>
                    </Tab>
                </TabList>
            </Tabs>

            <Box pl={8}>
                {/* Sections */}
                <Box id="about" py={4}>
                    <Heading as="h1">About Instructor</Heading>
                    <Flex pt={5} gap={6} pr={150}>
                        <Image
                            src="https://i.dawn.com/primary/2019/02/5c54a134a9d2e.jpg" // Replace with your image URL
                            alt="Circular Image"
                            boxSize="130px" // Adjust the size of the circle
                            borderRadius="full"
                            objectFit="cover"
                        />
                        <Stack>
                            <Heading fontWeight={650} fontSize={25} mt={3}>Ahmad Saya</Heading>
                            <Text fontSize={14}>
                                Jose Marcial Portilla has a BS and MS in Mechanical Engineering from Santa Clara University and years of experience as a professional instructor and trainer for Data Science, Machine Learning and Python Programming. Currently he works as the Head of Data Science for Pierian Training and provides in-person data science and python programming training courses to employees working at top companies, including General Electric, Cigna, SalesForce, Starbucks, McKinsey and many more.
                            </Text>
                        </Stack>
                    </Flex>

                </Box>

                <Box id="schedule" py={10}>
                    <Heading as="h1">Class Schedule</Heading>
                    <Flex>
                        <Schedule></Schedule>
                        <Stack ml={8}>
                            <Text mt={10} ml={-3}>Batch A:</Text>
                            <Text> 3:00 - 04:30 PM Monday </Text>
                            <Text> 5:30 - 07:00 PM  Thursday</Text>
                        </Stack>

                    </Flex>
                    {/* Add content related to the Schedule section here */}
                </Box>

                <Box id="location" py={10}>
                    <Heading as="h1" mb={1}>Location</Heading>
                    <Text fontSize={20} mb={8}>ASTC Bahadurabad</Text>
                    <OSMMap></OSMMap>
                    {/* <MapboxMap></MapboxMap> */}
                    {/* <MapComponent></MapComponent> */}
                    {/* <HereMap></HereMap> */}
                    {/* Add content related to the Location section here */}
                </Box>

                <Box id="fees" py={10}>
                    <Heading as="h1">Fees Structure Section</Heading>
                    <FeeTable></FeeTable>
                    {/* Add content related to the Fees Structure section here */}
                </Box>

                <Box id="reviews" py={10} mb={10}>
                    <Heading as="h1">Similar Courses</Heading>
                    <CourseCarousel courses={courses}></CourseCarousel>
                    {/* Add content related to the Reviews section here */}
                </Box>
            </Box>
        </div>
    );
};

export default CourseDetails;
