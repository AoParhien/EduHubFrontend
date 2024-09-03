import React from 'react';
import { Card, CardBody, Image, Stack, Flex, Icon, Text } from '@chakra-ui/react';
import harvard from '../../assets/harvard.svg'
import { TiLocation } from "react-icons/ti";


const InstituteCard = ({
    maxWidth = '600px',
    title = 'ASTC',
    price = 'PKR 5000/Month',
    level = 'Olevels'
}) => {
    const handleClick = () => {
        // Handle card click here, e.g., navigate to a detailed view
        alert('Card clicked');
    };

    return (
        <Card
            width="25vw"
            maxW={maxWidth}
            borderRadius="15px"
            boxShadow="md"
            p={1}
            cursor="pointer"
            border="1px solid"
            borderColor="#74B4FF"
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
                    src='https://png.pngtree.com/thumb_back/fh260/background/20230713/pngtree-3d-rendering-of-a-classroom-with-an-empty-blackboard-image_3868172.jpg'
                    alt='Green double couch with wooden legs'
                    borderRadius='20px'
                    width='100%'        // Ensure the image takes up 100% of the card's width
                    height='194px'      // Set the height explicitly
                    maxWidth='26vw'    // Limit the maximum width
                    maxHeight='164px'   // Limit the maximum height
                    objectFit='cover'   // Ensure the image covers the area without distortion
                />

                <Stack mt='2' spacing='1' ml='-2.5'>
                    <Flex alignItems="flex-end">
                        <Image
                            src={harvard}
                            alt="Harvard Logo"
                            maxWidth='70px'
                            marginRight='0.5rem'
                        />
                        <Stack spacing='0' marginBottom="0.8rem">
                            <Text
                                fontSize="20px"
                                fontWeight="500"
                            // marginBottom="1.5rem"
                            >
                                {title}
                            </Text>
                            <Text
                                fontSize="12px"
                                fontWeight='600'
                            >
                                O/A Levels & Matriculation
                            </Text>
                        </Stack>
                    </Flex>
                    <Flex align='center' mt='2'>
                        <Icon as={TiLocation} boxSize='26px' mr='1.5' ml='4' color='#7E869E' />
                        <Text color='black' fontSize='12px' fontWeight='600'>DHA, Karachi</Text>
                        <Text ml='auto' fontSize='12px' fontWeight='600'>104 teachers</Text>
                    </Flex>
                </Stack>
            </CardBody>
        </Card>
    );
}

export default InstituteCard;
