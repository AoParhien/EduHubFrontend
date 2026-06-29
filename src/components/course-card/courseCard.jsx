import React from 'react';
import { Card, CardBody, Image, Heading, Stack, Flex, Icon, Text, Box, Badge } from '@chakra-ui/react';
import { BsCreditCard2Back } from "react-icons/bs";
import { IoMdSchool } from "react-icons/io";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from 'react-router-dom';

const CourseCard = ({ title, institute, fees, board, imageUrl, id }) => {
  return (
    <Link to={`/course-details/${id}`} className="eduhub__course-card-link">
      <Card
        width="100%"
        height="100%"
        minH="430px"
        borderRadius="28px"
        borderWidth="1px"
        borderColor="blue.100"
        boxShadow="0 20px 44px -34px rgba(13, 59, 102, 0.55)"
        overflow="hidden"
        cursor="pointer"
        bg="white"
        _hover={{
          boxShadow: '0 26px 54px -34px rgba(13, 59, 102, 0.62)',
          transform: 'translateY(-6px)',
          transition: 'all 0.3s ease'
        }}
        _active={{
          boxShadow: '0 16px 32px -28px rgba(13, 59, 102, 0.55)',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease'
        }}
        display="flex"
        flexDirection="column"
      >
        <CardBody p={0} display="flex" flexDirection="column" height="100%">
          <Box height="210px" width="100%" position="relative" overflow="hidden">
            <Image
              src={imageUrl}
              alt={title}
              width="100%"
              height="100%"
              objectFit='cover'
            />
            <Box
              position="absolute"
              inset="0"
              bg="linear-gradient(180deg, rgba(6, 28, 52, 0.02) 0%, rgba(6, 28, 52, 0.62) 100%)"
            />
            <Flex position="absolute" top={4} left={4} right={4} justify="space-between" align="flex-start">
              <Badge
                bg="whiteAlpha.900"
                color="blue.800"
                px={3}
                py={1.5}
                borderRadius="full"
                fontSize="0.72rem"
                fontWeight="800"
              >
                {board}
              </Badge>
              <Box
                bg="whiteAlpha.900"
                color="blue.800"
                borderRadius="full"
                p={2.5}
                boxShadow="sm"
              >
                <Icon as={FiArrowUpRight} boxSize={4} />
              </Box>
            </Flex>
          </Box>
          <Stack spacing={4} flex={1} px={5} py={5}>
            <Heading 
              size='md' 
              noOfLines={2}
              color="gray.800"
              lineHeight="1.3"
            >
              {title}
            </Heading>
            <Flex
              align='center'
              gap={3}
              bg="blue.50"
              borderRadius="18px"
              px={3.5}
              py={3}
              borderWidth="1px"
              borderColor="blue.100"
            >
              <Icon as={IoMdSchool} boxSize={5} color="blue.700" />
              <Box minW={0}>
                <Text fontSize='xs' textTransform="uppercase" letterSpacing="0.14em" color="gray.500" fontWeight="700">
                  Institute
                </Text>
                <Text fontSize='sm' noOfLines={1} color="gray.700" fontWeight="600">
                  {institute}
                </Text>
              </Box>
            </Flex>
            <Flex 
              align='center' 
              justify="space-between"
              mt="auto"
              pt={1}
            >
              <Flex align='center' gap={2.5}>
                <Box
                  bg="gray.100"
                  color="gray.700"
                  borderRadius="14px"
                  p={2}
                >
                  <Icon as={BsCreditCard2Back} boxSize={4} />
                </Box>
                <Box>
                  <Text fontSize='xs' textTransform="uppercase" letterSpacing="0.14em" color="gray.500" fontWeight="700">
                    Monthly fee
                  </Text>
                  <Text color='blue.700' fontSize='md' fontWeight="800">
                    PKR {Number(fees || 0).toLocaleString()}
                  </Text>
                </Box>
              </Flex>
              <Box textAlign="right">
                <Text fontSize="xs" color="gray.500" fontWeight="700" textTransform="uppercase" letterSpacing="0.14em">
                  View
                </Text>
                <Text fontSize="sm" color="gray.700" fontWeight="700">
                  Details
                </Text>
              </Box>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CourseCard;
