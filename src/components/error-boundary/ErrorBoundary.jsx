import React from 'react';
import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EduHubFrontend render failure', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={{ base: 4, md: 8 }}
          py={10}
          position="relative"
          overflow="hidden"
          style={{ backgroundImage: 'linear-gradient(135deg, #e6f0ff 0%, #f8fbff 45%, #eef4ff 100%)' }}
        >
          <Box
            position="absolute"
            top="-120px"
            right="-80px"
            width="320px"
            height="320px"
            borderRadius="full"
            bg="blue.100"
            filter="blur(10px)"
            opacity={0.8}
          />
          <Box
            position="absolute"
            bottom="-140px"
            left="-100px"
            width="360px"
            height="360px"
            borderRadius="full"
            bg="cyan.100"
            filter="blur(12px)"
            opacity={0.7}
          />
          <Box
            maxW="2xl"
            width="100%"
            bg="rgba(255,255,255,0.92)"
            borderRadius="3xl"
            boxShadow="0 24px 80px rgba(31, 78, 121, 0.18)"
            p={{ base: 7, md: 10 }}
            border="1px solid"
            borderColor="whiteAlpha.700"
            position="relative"
            backdropFilter="blur(18px)"
          >
            <VStack spacing={5} align="flex-start">
              <Box
                px={4}
                py={2}
                bg="blue.50"
                color="blue.700"
                borderRadius="full"
                fontWeight="700"
                fontSize="sm"
                letterSpacing="0.08em"
                textTransform="uppercase"
              >
                Session Recovery
              </Box>
              <Heading size="xl" color="gray.800" lineHeight="1.1">
                We ran into a temporary app error.
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Your last action may have completed successfully, but this screen could not finish rendering. Reloading usually restores your session right away.
              </Text>
              <Box
                width="100%"
                bg="gray.50"
                borderRadius="2xl"
                p={5}
                border="1px solid"
                borderColor="gray.100"
              >
                <Text fontWeight="600" color="gray.700" mb={2}>
                  What you can do now
                </Text>
                <Text color="gray.600">Reload the app to retry with your current session, or go back to the home page and sign in again if needed.</Text>
              </Box>
              <HStack spacing={3} flexWrap="wrap">
                <Button colorScheme="blue" size="lg" onClick={this.handleReload}>
                  Reload app
                </Button>
                <Button variant="outline" size="lg" onClick={this.handleGoHome}>
                  Go home
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
