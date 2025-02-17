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
  useToast
} from '@chakra-ui/react';
import { MapPin, Phone, Mail, Globe, Clock, Users, ChevronLeft } from 'lucide-react';

const InstituteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstituteDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/institutes/getInstitute/${id}`);
        
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

    fetchInstituteDetails();
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
                <Icon as={MapPin} />
                <Text>
                  {institute.location?.address || 
                   `${institute.location?.coordinates[0].toFixed(6)}, ${institute.location?.coordinates[1].toFixed(6)}`}
                </Text>
              </HStack>
            </VStack>
          </Flex>
        </Box>
      </Box>

      {/* Main Content */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        {/* Left Content */}
        <Box gridColumn="span 2">
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab>About</Tab>
              <Tab>Courses</Tab>
              <Tab>Faculty</Tab>
              <Tab>Reviews</Tab>
              <Tab>Location</Tab>
            </TabList>

            <TabPanels>
              {/* About Tab */}
              <TabPanel>
                <VStack align="stretch" spacing={6}>
                  <Box>
                    <Heading size="md" mb={4}>About Institution</Heading>
                    <Text color="gray.600">
                      {institute.description || 
                       "A premier educational institution dedicated to providing quality education in various academic streams. We focus on holistic development and academic excellence."}
                    </Text>
                  </Box>

                  <Box>
                    <Heading size="md" mb={4}>Key Features</Heading>
                    <SimpleGrid columns={2} spacing={4}>
                      <HStack p={4} bg="blue.50" borderRadius="md">
                        <Icon as={Users} />
                        <Text>{institute.teacherCount || '100+'} Teachers</Text>
                      </HStack>
                      <HStack p={4} bg="blue.50" borderRadius="md">
                        <Icon as={Clock} />
                        <Text>Flexible Timing</Text>
                      </HStack>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Courses Tab */}
              <TabPanel>
                <SimpleGrid columns={2} spacing={6}>
                  {(institute.courses || [1, 2, 3, 4]).map((course, index) => (
                    <Box 
                      key={index}
                      p={6}
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      _hover={{ shadow: "md" }}
                    >
                      <VStack align="stretch" spacing={4}>
                        <Heading size="md">
                          {course.name || "O'Level Mathematics"}
                        </Heading>
                        <Text color="gray.600">
                          {course.duration || "Duration: 8 months"}
                        </Text>
                        <Divider />
                        <HStack justify="space-between">
                          <Text fontWeight="bold">
                            Rs. {course.fee || '5000'}/month
                          </Text>
                          <Button colorScheme="blue" size="sm">
                            View Details
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>

              {/* Other tabs can be implemented similarly */}
            </TabPanels>
          </Tabs>
        </Box>

        {/* Right Sidebar */}
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
            >
              Enroll Now
            </Button>
            
            <VStack align="stretch" w="full" spacing={4}>
              <Text fontWeight="bold">Contact Information</Text>
              <HStack>
                <Icon as={Phone} />
                <Text>{institute.phone || '+92 300 1234567'}</Text>
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
      </SimpleGrid>
    </Container>
  );
};

export default InstituteDetails;