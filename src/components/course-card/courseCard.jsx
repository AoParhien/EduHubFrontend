import React from 'react';
import { Card, CardBody, Image, Heading, Stack, Flex, Icon, Text, Box } from '@chakra-ui/react';
import { BsCreditCard2Back } from "react-icons/bs";
import { IoMdSchool } from "react-icons/io";
import { Link } from 'react-router-dom';

const CourseCard = ({ title, institute, fees, board, imageUrl, id }) => {
  const handleClick = () => {
    console.log("Image url: "+imageUrl)
  };

  return (
    <Link to={`/course-details/${id}`}>
      <Card
        width="320px"  // Fixed width instead of viewport units
        height="360px" // Fixed height to ensure consistency
        borderRadius="lg"
        boxShadow="md"
        p={2}
        cursor="pointer"
        _hover={{
          boxShadow: 'lg',
          transform: 'scale(1.02)',
          transition: 'all 0.3s ease'
        }}
        _active={{
          boxShadow: 'md',
          transform: 'scale(0.98)',
          transition: 'all 0.2s ease'
        }}
        onClick={handleClick}
      >
        <CardBody p={2} display="flex" flexDirection="column">
          <Box height="200px" width="100%"> {/* Fixed container for image */}
            <Image
              src={imageUrl}
              alt={title}
              borderRadius='md'
              width="100%"
              height="100%"
              objectFit='cover'
            />
          </Box>
          <Stack spacing={2} flex={1} mt={3}>
            <Heading 
              size='sm' 
              noOfLines={2} // Limit to 2 lines
              height="40px" // Fixed height for title
            >
              {title}
            </Heading>
            <Flex align='center'>
              <Icon as={IoMdSchool} boxSize={5} mr={2} />
              <Text fontSize='sm' noOfLines={1}>{institute}</Text>
            </Flex>
            <Flex 
              align='center' 
              justify="space-between"
              mt="auto" // Push to bottom
              pt={2}
            >
              <Flex align='center'>
                <Icon as={BsCreditCard2Back} boxSize={5} mr={2} />
                <Text color='blue.600' fontSize='sm'>
                  PKR {fees}/Month
                </Text>
              </Flex>
              <Box
                bg='gray.100'
                border='1px'
                borderColor='gray.300'
                borderRadius='md'
                px={2}
                py={1}
              >
                <Text fontSize='sm' color='teal'>{board}</Text>
              </Box>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CourseCard;