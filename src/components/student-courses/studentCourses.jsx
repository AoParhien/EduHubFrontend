import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Stack, 
  Text, 
  Grid,
  Card,
  CardBody,
  Badge,
  Flex,
  Icon,
  Divider,
  useToast
} from '@chakra-ui/react';
import { FaUser, FaClock, FaCalendar } from 'react-icons/fa';
import Schedule from '../schedule/schedule';
import CourseBatches from '../course-batches/courseBatches';

const StudentCourses = () => {
  const [studentCourses, setStudentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:3002/api/enrollment/studentEnrollments/67593b7a20022d3ab67f8b05`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        setStudentCourses(data);
      } catch (error) {
        toast({
          title: 'Error fetching courses',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Text>Loading courses...</Text>
      </Flex>
    );
  }

  if (studentCourses.length === 0) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Text>No courses found. Please enroll in a course to get started.</Text>
      </Flex>
    );
  }

  // Combine batches and schedules from all courses
  const combinedBatches = studentCourses.flatMap(course => 
    (course.courseDetails.batches || []).map(batch => ({
      ...batch,
      courseTitle: course.courseDetails.title // Add course title to each batch
    }))
  );
  const combinedSchedules = studentCourses.flatMap(course => course.courseDetails.schedules || []);

  return (
    <Box maxW="7xl" mx="auto" p={5}>
      <Heading color="#00308F" size="lg" mb={6}>My Courses</Heading>
      
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
        {studentCourses.map((course, index) => (
          <Card key={course.courseDetails.id || index} shadow="md" transition="all 0.2s" 
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}>
            <CardBody>
              <Stack spacing={4}>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="#00308F">{course.courseDetails.title}</Heading>
                  <Badge colorScheme="green">Active</Badge>
                </Flex>
                
                <Stack spacing={2}>
                  <Flex align="center">
                    <Icon as={FaUser} color="gray.500" mr={2} />
                    <Text fontSize="sm">{course.courseDetails.teacher.name}</Text>
                  </Flex>
                  
                  <Flex align="center">
                    <Icon as={FaClock} color="gray.500" mr={2} />
                    <Text fontSize="sm">{course.courseDetails.durationMonths} months</Text>
                  </Flex>
                  
                  <Flex align="center">
                    <Icon as={FaCalendar} color="gray.500" mr={2} />
                    <Text fontSize="sm">{course.courseDetails.classFormat}</Text>
                  </Flex>
                </Stack>

                <Divider />
                
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Grid>
      <Box id="schedule" py={10}>
        <Heading as="h2" size="lg">Class Schedule</Heading>
        <Flex flexDirection={{ base: 'column', md: 'row' }}>
          <Schedule batches={combinedBatches} schedules={combinedSchedules} />
          <Stack ml={{ base: 0, md: 15 }} mt={{ base: 5, md: 0 }} spacing={5} width={{ base: '100%', md: '400px' }}>
            <CourseBatches batches={combinedBatches} schedules={combinedSchedules}/>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
};

export default StudentCourses;
