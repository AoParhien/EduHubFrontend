import React from 'react';
import { Card, CardBody, Image, Heading, Stack, Flex, Text, Box, Badge } from '@chakra-ui/react';
import { FiArrowUpRight } from "react-icons/fi";

const InstructorCard = ({ teacherName, board, image, widthCard ="100px", heightCardBody ="100px" }) => {
    return (
        <Card
            width={widthCard}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="brand.100"
            boxShadow="0 22px 44px -34px rgba(13, 59, 102, 0.32)"
            cursor="pointer"
            _hover={{
                boxShadow: '0 28px 56px -34px rgba(13, 59, 102, 0.42)',
                transform: 'translateY(-6px)',
                transition: '0.3s'
            }}
            _active={{
                boxShadow: '0 18px 34px -28px rgba(13, 59, 102, 0.35)',
                transform: 'translateY(-2px)',
                transition: '0.2s'
            }}
            overflow="hidden"
            bg="linear-gradient(180deg, #ffffff 0%, #f7faff 100%)"
        >
            <CardBody p={0} m={0} height={heightCardBody} display="flex" flexDirection="column">
                <Box position="relative">
                    <Image
                        src={image}
                        alt={teacherName}
                        objectFit='cover'
                        height="220px"
                        width="100%"
                    />
                    <Box
                        position="absolute"
                        inset="0"
                        bg="linear-gradient(180deg, rgba(6, 28, 52, 0.04) 0%, rgba(6, 28, 52, 0.55) 100%)"
                    />
                    <Box
                        position="absolute"
                        top={4}
                        right={4}
                        bg="whiteAlpha.900"
                        color="brand.500"
                        p={2.5}
                        borderRadius="full"
                    >
                        <FiArrowUpRight />
                    </Box>
                </Box>
                <Stack mt='2' spacing='3' p={4}>
                    <Flex align='center' mt='2' justify="space-between" gap={3}>
                        <Heading size='sm' color="gray.800">{teacherName}</Heading>
                        {board && board !== "N/A" && (
                            <Badge colorScheme="blue" variant="subtle" px={3} py={1.5}>
                                {board}
                            </Badge>
                        )}
                    </Flex>
                    <Text fontSize="sm" color="gray.600">
                        Top-rated instructor currently featured on EduHub.
                    </Text>
                </Stack>
            </CardBody>
        </Card>
    );
}

export default InstructorCard;
