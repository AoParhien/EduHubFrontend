import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react';
import PageTitle from '../page-title/PageTitle';

const NotFound = () => (
  <Box className="page" py={{ base: 16, md: 24 }}>
    <PageTitle title="Page not found" />
    <Box maxW="560px">
      <Text color="muted" fontWeight="500" mb={3}>Error 404</Text>
      <Heading as="h1" fontSize={{ base: '2xl', md: '4xl' }} mb={4}>
        This page doesn't exist
      </Heading>
      <Text color="muted" fontSize="lg" mb={8}>
        The link may be broken or the page may have moved. You can browse courses or go back to the home page.
      </Text>
      <HStack spacing={3} flexWrap="wrap">
        <Button as={RouterLink} to="/courses" size="lg">Browse courses</Button>
        <Button as={RouterLink} to="/" size="lg" variant="outline">Go to home page</Button>
      </HStack>
    </Box>
  </Box>
);

export default NotFound;
