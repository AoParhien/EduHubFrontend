import React from 'react';
import { Box, Container, Text, Heading } from '@chakra-ui/react';
import CourseCarousel from '../course-carousal/CourseCarousel';

const CrashCourseSection = () => {
  const courses = [
    {
      title: 'Google Cybersecurity',
      institute: 'Google',
      fees: 5000,
      board: 'Professional Certificate',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR31uhAZikQ54yIhsqojJ4zTmoeNHAtGW3grQ&s',
      id: 125,
    },
    {
      title: 'Google Digital Marketing & E-commerce',
      institute: 'Google',
      fees: 4500,
      board: 'Professional Certificate',
      imageUrl: 'https://bloggerpilot.com/wp-content/uploads/2022/05/google-marketing-certificate.png',
      id: 124,
    },
    {
      title: 'Google UX Design',
      institute: 'Google',
      fees: 4000,
      board: 'Professional Certificate',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4GcFxzAEwvICnbb9Q_i7dZE3dM93TaU5SyA&s',
      id: 123,
    },
  ];

  return (
    <Box py={16} bgGradient="linear(to-br, blue.900, blue.700)">
      <Container maxW="container.xl" px={4}>
        {/* Section Header */}
        <Box textAlign="center" mb={12} maxW="3xl" mx="auto">
          <Heading as="h2" size="xl" color="white" mb={4}>
         Browse through crash courses of your choice
          </Heading>
          <Text fontSize="lg" color="blue.100" mb={8}>
            Accelerate your career with industry-recognized credentials designed by Google experts to help you become job-ready
          </Text>
        </Box>

        {/* Course Carousel */}
        <CourseCarousel courses={courses} />
      </Container>
    </Box>
  );
};

export default CrashCourseSection;
