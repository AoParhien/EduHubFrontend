import React from 'react';
import { Card, CardBody, Image, Heading, Stack, Flex, Text, Box } from '@chakra-ui/react';

const InstructorCard = ({ teacherName, board, image }) => {
    const handleClick = () => {
        // Handle card click here, e.g., navigate to a detailed view
        alert('Card clicked');
    };

    return (
        <Card
            width="100px"
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
            overflow="hidden" // Ensure the image doesn't overflow the card
        >
            <CardBody p={0} m={0} height="100px">
                <Image
                    src={image}
                    alt={teacherName}
                    borderRadius='lg'
                    objectFit='cover'
                    height="auto"
                    width="200px"
                />
                <Stack mt='2' spacing='1' p={1}>
                    <Flex align='center' mt='2'>
                        <Heading size='sm'>{teacherName}</Heading>
                        <Box
                            position='relative'
                            ml='auto'
                            p='1'
                        >
                            <Text fontSize='sm' color='teal'>{board}</Text>
                        </Box>
                    </Flex>
                </Stack>
            </CardBody>
        </Card>
    );
}

export default InstructorCard;
