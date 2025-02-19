// InstituteCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Image, Heading, Stack, Flex, Text, Box, Badge, HStack, Icon } from '@chakra-ui/react';
import { MapPin, Users, Clock } from 'lucide-react';

const InstituteCard = ({ 
  _id, 
  name, 
  registrationFees, 
  pictureUrl, 
  logoUrl, 
  location,
  studentCount,
  categories = [],
  rating
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/institute/${_id}`);
    };

    return (
        <Card
            width="100%"
            borderRadius="lg"
            boxShadow="md"
            p={1}
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
            overflow="hidden"
            bg="white"
        >
            <CardBody p={0}>
                <Box position="relative">
                    <Image
                        src={pictureUrl || '/api/placeholder/400/200'}
                        alt={name}
                        borderRadius='lg'
                        objectFit='cover'
                        height="200px"
                        width="100%"
                    />
                    {rating && (
                        <Badge
                            position="absolute"
                            top={2}
                            right={2}
                            colorScheme={rating >= 4 ? "green" : "orange"}
                            px={2}
                            py={1}
                            borderRadius="md"
                        >
                            ★ {rating.toFixed(1)}
                        </Badge>
                    )}
                </Box>

                <Stack mt='4' spacing='3' p={4}>
                    {/* <Flex align='center' justify='space-between'>
                        <Box>
                            <Heading size='md' mb={1}>{name}</Heading>
                            <HStack spacing={2} color="gray.600" fontSize="sm">
                                <Icon as={MapPin} size={16} />
                                <Text>
                                    {location?.address || 
                                     `${location?.coordinates[0].toFixed(6)}, ${location?.coordinates[1].toFixed(6)}`}
                                </Text>
                            </HStack>
                        </Box>
                        <Image
                            src={logoUrl || '/api/placeholder/50/50'}
                            alt={`${name} logo`}
                            borderRadius='full'
                            boxSize='50px'
                            objectFit='cover'
                            border="2px"
                            borderColor="gray.200"
                        />
                    </Flex> */}

                    <Flex gap={4} mt={2}>
                        <HStack spacing={1} fontSize="sm" color="gray.600">
                            <Icon as={Users} size={16} />
                            <Text>{studentCount || '1000+'} Students</Text>
                        </HStack>
                        <HStack spacing={1} fontSize="sm" color="gray.600">
                            <Icon as={Clock} size={16} />
                            <Text>Flexible Timing</Text>
                        </HStack>
                    </Flex>

                    <Box>
                        <Flex gap={2} flexWrap="wrap">
                            {categories.map((category, index) => (
                                <Badge
                                    key={index}
                                    colorScheme="blue"
                                    variant="subtle"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                >
                                    {category}
                                </Badge>
                            ))}
                        </Flex>
                    </Box>

                    <Flex justify="space-between" align="center" mt={2}>
                        <Text fontWeight="bold" color="blue.600">
                            Registration Fee: Rs. {registrationFees.toLocaleString()}
                        </Text>
                    </Flex>
                </Stack>
            </CardBody>
        </Card>
    );
};

export default InstituteCard;