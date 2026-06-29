import React from 'react';
import { Box, Text, Grid, Heading } from '@chakra-ui/react';
import { FaRegCalendarAlt, FaMapMarkerAlt, FaMoneyBillAlt, FaUserGraduate } from 'react-icons/fa';

const featureCards = [
  {
    id: 'chapter-wise-mcqs',
    title: 'Register from Anywhere, Anytime',
    icon: <FaMapMarkerAlt size={50} color="#F6D33C" />,
    description:
      'Say goodbye to long queues and institute visits. Enjoy seamless online registration from the comfort of your home.'
  },
  {
    id: 'past-paper-flps',
    title: 'Tailored Timetables Just for You',
    icon: <FaRegCalendarAlt size={50} color="#00308F" />,
    description:
      'We craft personalized timetables to ensure your classes are conflict-free and perfectly scheduled.'
  },
  {
    id: 'chapter-wise-shortlistings',
    title: 'One-Stop Institute Marketplace',
    icon: <FaUserGraduate size={50} color="#00308F" />,
    description:
      'Explore a diverse range of institutes and courses, all brought together in one convenient platform.'
  },
  {
    id: 'live-lectures',
    title: 'No Extra Fees, Guaranteed Seats',
    icon: <FaMoneyBillAlt size={50} color="#F6D33C" />,
    description:
      'Book seats without worrying about extra costs. Your seat is secured, and your learning journey is our priority.'
  }
];

const Features = () => {
  return (
    <div>
      <Heading
        as="h2"
        fontSize={{ base: "32px", md: "55px" }} 
        lineHeight={{ base: "48px", md: "83px" }}
        textAlign="center"
        mb={0}
      >
        What we offer you?
      </Heading>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap={12}
        maxW="1200px"
        mx="auto"
        px={6}
        py={16}
      >
        {featureCards.map((feature) => (
          <Box
            key={feature.id}
            border="1px solid"
            borderColor="brand.100"
            borderRadius="2xl"
            p={8}
            textAlign="center"
            bg="linear-gradient(180deg, #ffffff 0%, #f7faff 100%)"
            boxShadow="0 22px 44px -34px rgba(13, 59, 102, 0.32)"
            transition="transform 0.3s ease-in-out"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 28px 56px -34px rgba(13, 59, 102, 0.42)' }}
          >
            {feature.icon}
            <Text fontSize="24px" fontWeight="700" color="brand.500" mt={4} mb={2}>
              {feature.title}
            </Text>
            <Text fontSize="18px" color="gray.600" mb={4}>
              {feature.description}
            </Text>
            
          </Box>
        ))}
      </Grid>
    </div>
  );
};

export default Features;
