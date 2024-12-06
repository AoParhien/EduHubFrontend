import React from 'react';
import { Card, CardBody, Image, Stack, Flex, Icon, Text, Box } from '@chakra-ui/react';
import harvard from '../../assets/harvard.svg';
import { TiLocation } from "react-icons/ti";

const InstituteCard = ({
    maxWidth = '600px',
    title = 'ASTC',
    level = 'Olevels'
}) => {
    const handleClick = () => {
        alert('Card clicked');
    };

    // Custom colors
    const colors = {
        yellow: '#F6D33C',
        blue: '#00308F',
        softGray: '#F5F5F5'
    };

    return (
        <Card
            width="100%"
            maxW={maxWidth}
            borderRadius="15px"
            boxShadow="md"
            overflow="hidden"
            cursor="pointer"
            border="1px solid"
            borderColor={colors.blue}
            bg={colors.softGray}
            _hover={{
                boxShadow: 'lg',
                transform: 'translateY(-5px)',
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

                <Stack p="1rem" spacing="1rem">
                    <Flex alignItems="center">
                        <Image
                            src={harvard}
                            alt="Institute Logo"
                            width="50px"
                            height="50px"
                            borderRadius="full"
                            mr="1rem"
                            border="2px solid"
                            borderColor={colors.blue}
                        />
                        <Stack spacing='0'>
                            <Text 
                                fontSize="18px" 
                                fontWeight="bold" 
                                color={colors.blue}
                            >
                                {title}
                            </Text>
                            <Text 
                                fontSize="14px" 
                                color="gray.600"
                            >
                                {level} & Matriculation
                            </Text>
                        </Stack>
                    </Flex>

                    <Flex 
                        align='center' 
                        mt='0.5rem' 
                        p='0.5rem' 
                       // bg={`${colors.yellow}20`} // Soft yellow background with opacity
                        borderRadius="10px"
                    >
                        <Icon 
                            as={TiLocation} 
                            boxSize='20px' 
                            mr='0.5rem' 
                            color={colors.blue} 
                        />
                        <Text 
                            color={colors.blue} 
                            fontSize='14px' 
                            fontWeight='600'
                        >
                            DHA, Karachi
                        </Text>
                        <Box ml='auto'>
                            <Text 
                                fontSize='12px' 
                                fontWeight='600' 
                                bg={`${colors.yellow}`} 
                                color={colors.blue}
                               //opacity={}
                                borderRadius="10px"
                     
                                p='0.4rem' 
                            >
                                104 teachers
                            </Text>
                        </Box>
                    </Flex>
                </Stack>
            </CardBody>
        </Card>
    );
};

export default InstituteCard;