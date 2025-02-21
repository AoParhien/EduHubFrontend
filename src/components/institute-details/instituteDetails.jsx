import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Badge,
  SimpleGrid,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Icon,
  Divider,
  useToast,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { MapPin, Phone, Mail, Globe, Clock, Users, ChevronLeft } from 'lucide-react';
import { BsFilterRight } from 'react-icons/bs';
import CourseCard from '../course-card/courseCard';
import MapWithPlusCode from '../map/map';
import InstructorCard from '../instructor-card/instructorCard';

const selectedFontWeight = 650;

const InstituteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instituteCourses, setInstituteCourses] = useState([]);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const responsivePadding = useBreakpointValue({ base: 2, md: 5 });
  const responsiveHeadingSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const [teachers, setTeachers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tabIndex, setTabIndex] = useState(0);

  // Responsive width for the registration box
  const registrationBoxWidth = useBreakpointValue({ 
    base: "90%", 
    md: "100%" 
  });

  const fetchInstituteDetails = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_INSTITUTE_SERVICE_URL;
      const response = await fetch(`${apiUrl}/api/institutes/${id}`);
                
      if (!response.ok) {
        throw new Error('Failed to fetch institute details');
      }

      const data = await response.json();
      setInstitute(data);
    } catch (err) {
      setError('Failed to load institute details. Please try again later.');
      console.error('Error fetching institute details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIntituteCourses = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_INSTITUTE_SERVICE_URL;
      const response = await fetch(`${apiUrl}/api/courses/getCourseByInstitute/${id}`);
                
      if (!response.ok) {
        throw new Error('Failed to fetch institute details');
      }

      const data = await response.json();
      setInstituteCourses(data);
    } catch (err) {
      setError('Failed to load courses details. Please try again later.');
      console.error('Error fetching courses details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_INSTITUTE_SERVICE_URL;
      const response = await fetch(`${apiUrl}/api/faculty/getFacultiesByInstitute/${id}`);
                
      if (!response.ok) {
        throw new Error('Failed to fetch institute details');
      }

      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      setError('Failed to load teachers details. Please try again later.');
      console.error('Error fetching teachers details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstituteDetails();
    fetchIntituteCourses();
    fetchTeachers();
  }, [id]);

  const handleEnrollNow = () => {
    toast({
      title: "Enrollment Initiated",
      description: "Please complete the registration process",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // Add enrollment logic here
  };

  // Mobile Tabs Drawer
  const MobileTabDrawer = () => (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent borderTopRadius="lg">
        <DrawerCloseButton />
        <DrawerHeader>Institute Sections</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            {['Courses', 'Faculty', 'Reviews', 'Location'].map((tab, idx) => (
              <Button
                key={tab}
                width="full"
                variant="ghost"
                onClick={() => {
                  setTabIndex(idx);
                  onClose();
                }}
              >
                {tab}
              </Button>
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  // Mobile registration box component
  const MobileRegistrationBox = () => (
    <Box width="100%" display="flex" justifyContent="center" mt={8} mb={8}>
      <VStack
        spacing={4}
        p={6}
        bg="white"
        borderRadius="xl"
        border="1px"
        borderColor="gray.200"
        width={registrationBoxWidth}
        mx="auto"
      >
        <Heading size="md" textAlign="center">Registration Details</Heading>
        <Divider />
        <HStack justify="space-between" w="full">
          <Text>Registration Fee:</Text>
          <Text fontWeight="bold">
            Rs. {institute.registrationFees?.toLocaleString()}
          </Text>
        </HStack>
        <Button 
          colorScheme="blue" 
          w="full"
          onClick={handleEnrollNow}
          background="#00308F"
          color="white"
        >
          Enroll Now
        </Button>
        
        <VStack align="stretch" w="full" spacing={4}>
          <Text fontWeight="bold" textAlign="center">Contact Information</Text>
          <HStack justify="center">
            <Icon as={Phone} />
            <Text>{institute.contactNumber || '+92 300 1234567'}</Text>
          </HStack>
          <HStack justify="center">
            <Icon as={Mail} />
            <Text>{institute.email || 'contact@institute.edu'}</Text>
          </HStack>
          <HStack justify="center">
            <Icon as={Globe} />
            <Text>{institute.website || 'www.institute.edu'}</Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );

  if (loading) {
    return <Container maxW="container.xl" py={8}>Loading...</Container>;
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Heading color="red.500">Error</Heading>
          <Text>{error}</Text>
          <Button 
            leftIcon={<ChevronLeft />} 
            onClick={() => navigate(-1)}
            colorScheme="blue"
          >
            Go Back
          </Button>
        </VStack>
      </Container>
    );
  }

  if (!institute) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Heading>Institute Not Found</Heading>
          <Button 
            leftIcon={<ChevronLeft />} 
            onClick={() => navigate(-1)}
            colorScheme="blue"
          >
            Go Back
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Back Button */}
      <Button
        leftIcon={<ChevronLeft />}
        onClick={() => navigate(-1)}
        mb={4}
        variant="ghost"
      >
        Back to Institutes
      </Button>

      {/* Hero Section */}
      <Box 
        position="relative" 
        height="300px" 
        borderRadius="xl" 
        overflow="hidden"
        mb={6}
      >
        <Image
          src={institute.pictureUrl}
          alt={institute.name}
          objectFit="cover"
          w="full"
          h="full"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="rgba(0,0,0,0.7)"
          p={6}
          color="white"
        >
          <Flex align="center" gap={4}>
            <Image
              src={institute.logoUrl}
              alt={`${institute.name} logo`}
              boxSize="80px"
              borderRadius="full"
              border="2px"
              borderColor="white"
            />
            <VStack align="flex-start" spacing={2}>
              <Heading size="lg">{institute.name}</Heading>
              <HStack>
                {/* <Icon as={MapPin} />
                <Text>
                  {institute.location?.address || 
                   `${institute.location?.coordinates[0].toFixed(6)}, ${institute.location?.coordinates[1].toFixed(6)}`}
                </Text> */}
              </HStack>
            </VStack>
          </Flex>
        </Box>
      </Box>

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

      {/* Main Content */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        {/* Left Content */}
        <Box gridColumn="span 2">
          <Tabs 
            variant="unstyled" 
            index={tabIndex} 
            onChange={(index) => setTabIndex(index)}
          >
            {/* Custom Tab List Style matched with courseDetails */}
            <TabList 
              justifyContent="flex-start" 
              bg="#00308F" 
              pl={10} 
              py={3}
              display={isMobile ? "none" : "flex"}
            >
              {['Courses', 'Faculty', 'Reviews', 'Location'].map((tab) => (
                <Tab 
                  key={tab} 
                  _selected={{ fontWeight: selectedFontWeight, color: 'white' }} 
                  _hover={{ color: 'whiteAlpha.800' }} 
                  color={'white'}
                >
                  {tab}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {/* Courses Tab */}
              <TabPanel>
                <Heading size={responsiveHeadingSize} mb={6}>Courses</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {(instituteCourses).map((course, index) => (
                    <Box key={course.courseId}>
                      <CourseCard 
                        title={course.title} 
                        institute={institute.name} 
                        fees={course.fees} 
                        board={course.board} 
                        imageUrl={course.imageUrl} 
                        id={course._id} 
                      />
                    </Box>
                  ))}
                </SimpleGrid>
                
                {/* Registration Box after content in mobile view */}
                {isMobile && <MobileRegistrationBox />}
              </TabPanel>

              {/* Faculty Tab */}
              <TabPanel>
                <Heading size={responsiveHeadingSize} mb={6}>Faculty</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {teachers.map((teacher, index) => (
                    <InstructorCard
                      key={teacher?.teacher_id._id || index}
                      teacherName={teacher?.teacher_id.name || 'Unknown Instructor'}
                      board={teacher?.boards?.[0] || 'N/A'}
                      image={teacher?.teacher_id.pictureUrl || 'defaultImagePath'}
                      widthCard={"300px"}
                      heightCardBody={"300px"}
                      widthImage={"100%"}
                    />
                  ))}
                </SimpleGrid>
                
                {/* Registration Box after content in mobile view */}
                {isMobile && <MobileRegistrationBox />}
              </TabPanel>

              {/* Reviews Tab */}
              <TabPanel>
                <Heading size={responsiveHeadingSize} mb={6}>Reviews</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {(instituteCourses).map((course, index) => (
                    <Box key={course.courseId}>
                      <CourseCard 
                        title={course.title} 
                        institute={institute.name} 
                        fees={course.fees} 
                        board={course.board} 
                        imageUrl={course.imageUrl} 
                        id={course._id} 
                      />
                    </Box>
                  ))}
                </SimpleGrid>
                
                {/* Registration Box after content in mobile view */}
                {isMobile && <MobileRegistrationBox />}
              </TabPanel>

              {/* Location Tab */}
              <TabPanel>
                <Box id="location" py={4}>
                  <Heading 
                    as="h2" 
                    size={responsiveHeadingSize} 
                    textAlign={isMobile ? 'center' : 'left'}
                    mb={6}
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
                  <Box width="100%" height={isMobile ? '250px' : '400px'} mb={6}>
                    <MapWithPlusCode plusCode={institute.plusCode} coordinates={institute.location.coordinates}/>
                  </Box>
                  
                  {/* Registration Box after content in mobile view */}
                  {isMobile && <MobileRegistrationBox />}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Right Sidebar - Only shown on desktop */}
        {!isMobile && (
          <Box>
            <VStack
              spacing={4}
              p={6}
              bg="white"
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              position="sticky"
              top={4}
            >
              <Heading size="md">Registration Details</Heading>
              <Divider />
              <HStack justify="space-between" w="full">
                <Text>Registration Fee:</Text>
                <Text fontWeight="bold">
                  Rs. {institute.registrationFees?.toLocaleString()}
                </Text>
              </HStack>
              <Button 
                colorScheme="blue" 
                w="full"
                onClick={handleEnrollNow}
                background="#00308F"
                color="white"
              >
                Enroll Now
              </Button>
              
              <VStack align="stretch" w="full" spacing={4}>
                <Text fontWeight="bold">Contact Information</Text>
                <HStack>
                  <Icon as={Phone} />
                  <Text>{institute.contactNumber || '+92 300 1234567'}</Text>
                </HStack>
                <HStack>
                  <Icon as={Mail} />
                  <Text>{institute.email || 'contact@institute.edu'}</Text>
                </HStack>
                <HStack>
                  <Icon as={Globe} />
                  <Text>{institute.website || 'www.institute.edu'}</Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        )}
      </SimpleGrid>
    </Container>
  );
};

export default InstituteDetails;