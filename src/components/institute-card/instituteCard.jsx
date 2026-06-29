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
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="brand.100"
            boxShadow="0 22px 44px -34px rgba(13, 59, 102, 0.32)"
            cursor="pointer"
            _hover={{
                boxShadow: '0 28px 56px -34px rgba(13, 59, 102, 0.42)',
                transform: 'translateY(-6px)',
                transition: 'all 0.3s ease'
            }}
            _active={{
                boxShadow: '0 18px 34px -28px rgba(13, 59, 102, 0.35)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease'
            }}
            onClick={handleClick}
            overflow="hidden"
            bg="linear-gradient(180deg, #ffffff 0%, #f7faff 100%)"
        >
            <CardBody p={0}>
                <Box position="relative">
                    <Image
                        src={pictureUrl || '/api/placeholder/400/200'}
                        alt={name}
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
                            borderRadius="full"
                        >
                            ★ {rating.toFixed(1)}
                        </Badge>
                    )}
                </Box>

                <Stack mt='4' spacing='3' p={4}>
                    <Flex align='center' justify='space-between'>
                        <Box>
                            <Heading size='md' mb={1}>{name}</Heading>
                            {/* <HStack spacing={2} color="gray.600" fontSize="sm">
                                <Icon as={MapPin} size={16} />
                                <Text>
                                    {location?.address || 
                                     `${location?.coordinates[0].toFixed(6)}, ${location?.coordinates[1].toFixed(6)}`}
                                </Text>
                            </HStack> */}
                        </Box>
                        <Image
                            src={logoUrl || '/api/placeholder/50/50'}
                            alt={`${name} logo`}
                            borderRadius='full'
                            boxSize='50px'
                            objectFit='cover'
                            border="2px"
                            borderColor="brand.100"
                        />
                    </Flex>

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
                                    borderRadius="full"
                                >
                                    {category}
                                </Badge>
                            ))}
                        </Flex>
                    </Box>

                    <Flex justify="space-between" align="center" mt={2}>
                        <Text fontWeight="bold" color="brand.500">
                            Registration Fee: Rs. {registrationFees.toLocaleString()}
                        </Text>
                    </Flex>
                </Stack>
            </CardBody>
        </Card>
    );
};

export default InstituteCard;
