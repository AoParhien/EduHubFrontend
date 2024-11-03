import React from 'react';
import { Card, CardBody, Image, Heading, Stack, Flex, Icon, Text, Box } from '@chakra-ui/react';
import { BsCreditCard2Back } from "react-icons/bs";
import { IoMdSchool } from "react-icons/io";
import { Link } from 'react-router-dom';

const CourseCard = ({ title, institute, fees, board, image, id }) => {
  const handleClick = () => {
  };

  return (
    <Link to={`/course-details/${id}`}>
      <Card
        width='20vw'
        maxW='500px'
        borderRadius="lg"
        boxShadow="md"
        p={1}
        cursor="pointer"
        _hover={{
          boxShadow: 'lg',
          transform: 'scale(1.02)',
          transition: '0.3s'
        }}
        _active={{
          boxShadow: 'md',
          transform: 'scale(0.98)',
          transition: '0.2s'
        }}
        onClick={handleClick}
      >
        <CardBody p={1}>
          <Image
            src={image}
            alt={title}
            borderRadius='md'
            width='100%'
            maxWidth='20vw'
            maxH='200px'
            objectFit='cover'
          />
          <Stack mt='2' spacing='1'>
            <Heading size='sm'>{title}</Heading>
            <Flex align='center' mt='2'>
              <Icon as={IoMdSchool} boxSize='20px' mr='2' />
              <Text fontSize='sm'>{institute}</Text>
            </Flex>
            <Flex align='center' mt='2'>
              <Icon as={BsCreditCard2Back} boxSize='20px' mr='2' />
              <Text color='blue.600' fontSize='sm'>PKR {fees}/Month</Text>
              <Box
                position='relative'
                ml='auto'
                bg='gray.100'
                border='1px'
                borderColor='gray.300'
                borderRadius='md'
                p='1'
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