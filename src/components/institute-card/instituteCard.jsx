import React from 'react';
import { Card, CardBody, Image, Stack, Flex, Icon, Text, Box } from '@chakra-ui/react';
import harvard from '../../assets/harvard.svg';
import { TiLocation } from "react-icons/ti";

const InstituteCard = ({
    maxWidth = '600px',
    title = 'ASTC',
  //  price = 'PKR 5000/Month',
    level = 'Olevels'
}) => {
    const handleClick = () => {
        alert('Card clicked');
    };

    return (
        <Card
            width="100%"               // Allow card to take full width of container
            maxW={maxWidth}
            borderRadius="15px"
            boxShadow="md"
            overflow="hidden"           // Ensure elements inside don't overflow the card
            cursor="pointer"
            border="1px solid"
            borderColor="rgba(0, 0, 0, 0.1)"  // Subtle border color
            _hover={{
                boxShadow: 'lg',
                transform: 'translateY(-10px)', // Lift the card on hover
                transition: '0.3s ease-in-out'
            }}
            _active={{
                boxShadow: 'md',
                transform: 'scale(0.98)',
                transition: '0.2s'
            }}
            onClick={handleClick}
        >
            <CardBody p={0}>
                <Image
                    src='https://png.pngtree.com/thumb_back/fh260/background/20230713/pngtree-3d-rendering-of-a-classroom-with-an-empty-blackboard-image_3868172.jpg'
                    alt='Institute classroom'
                    width='100%'
                    height='180px'
                    objectFit='cover'
                />

                <Stack p="1rem">
                    <Flex alignItems="center">
                        <Image
                            src={harvard}
                            alt="Institute Logo"
                            width="50px"
                            height="50px"
                            borderRadius="full"
                            mr="1rem"
                        />
                        <Stack spacing='0'>
                            <Text fontSize="18px" fontWeight="bold" color="#333">{title}</Text>
                            <Text fontSize="14px" color="gray.500">{level} & Matriculation</Text>
                        </Stack>
                    </Flex>

                    <Flex align='center' mt='1.5rem'>
                        <Icon as={TiLocation} boxSize='20px' mr='0.5rem' color='#4A5568' />
                        <Text color='#4A5568' fontSize='14px' fontWeight='600'>DHA, Karachi</Text>
                        <Box ml='auto'>
                            <Text fontSize='12px' fontWeight='600' color='gray.500'>104 teachers</Text>
                        </Box>
                    </Flex>

                </Stack>
            </CardBody>
        </Card>
    );
};

export default InstituteCard;
