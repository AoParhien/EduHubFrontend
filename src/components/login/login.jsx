import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    Text,
    VStack,
    Link,
    Image,
    useToast,
    Flex,
    useBreakpointValue,
} from '@chakra-ui/react';
import axios from 'axios';
import useUserStore from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const FloatingLabelInput = ({ label, register, name, errors, type = "text", leftAddon, rules, ...rest }) => (
    <FormControl isInvalid={errors[name]} position="relative">
        <InputGroup size="lg">
            {leftAddon && (
                <InputLeftAddon 
                    children={leftAddon}
                    height="3.5rem"
                    alignItems="center"
                    minW="4.5rem"
                    px={3}
                />
            )}
            <Input
                placeholder=" "
                {...register(name, rules)}
                type={type}
                id={name}
                height="3.5rem"
                pt="1.75rem"
                pb="0.75rem"
                pl={leftAddon ? "0.75rem" : "1rem"}
                {...rest}
            />
            <FormLabel
                htmlFor={name}
                position="absolute"
                top="0"
                left={leftAddon ? "4.5rem" : "1rem"}
                zIndex="2"
                px="0.5rem"
                fontSize="sm"
                fontWeight="medium"
                bg="white"
                marginInlineStart="0"
                transition="all 0.2s"
                transform="translateY(0.75rem)"
                pointerEvents="none"
                _focus={{
                    fontSize: "xs",
                    fontWeight: "bold",
                    transform: "translateY(0.25rem)",
                }}
                sx={{
                    'input:not(:placeholder-shown) + &': {
                        fontSize: "xs",
                        fontWeight: "bold",
                        transform: "translateY(0.25rem)",
                    },
                }}
            >
                {label}
            </FormLabel>
        </InputGroup>
        <FormErrorMessage>
            {errors[name]?.message}
        </FormErrorMessage>
    </FormControl>
);

const LoginForm = () => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
        reset 
    } = useForm({
        mode: 'onTouched',
    });
    const { fetchUser } = useUserStore();
    const toast = useToast();
    const navigate = useNavigate(); // Initialize useNavigate

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: data.email,
                password: data.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
    
            if (response.data) {
                toast({
                    title: "Login successful!",
                    description: "Welcome back!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                reset();
                fetchUser();
                navigate("/");
            }
        } catch (error) {
            console.error('Error:', error);
    
            if (error.response) {
                const { status, data } = error.response;
    
                switch (status) {
                    case 400:
                        if (data.message) {
                            toast({
                                title: "Validation Error",
                                description: data.message,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                            });
                        }
                        break;
                    
                    case 401:
                        toast({
                            title: "Invalid Credentials",
                            description: "Invalid email or password.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                        break;
                    
                    case 500:
                        toast({
                            title: "Server Error",
                            description: "Unable to login. Please try again later.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                        break;
                    
                    default:
                        toast({
                            title: "Error",
                            description: "An unexpected error occurred. Please try again.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                }
            } else if (error.request) {
                toast({
                    title: "Connection Error",
                    description: "Unable to connect to the server. Please check your internet connection.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    // Determine layout direction based on screen size
    const flexDirection = useBreakpointValue({ base: 'column', md: 'row' });
    const imageDisplay = useBreakpointValue({ base: 'none', md: 'block' });

    return (
        <Flex 
            direction={flexDirection} 
            minH="80vh"
        >
            <Box 
                flex={1} 
                display={imageDisplay}
            >
                <Image
                    src="https://as1.ftcdn.net/v2/jpg/01/75/84/48/1000_F_175844887_q9693JpeyWzJikA7xSKdMLwKgzdGHaEx.jpg"
                    alt="Login Image"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                />
            </Box>
            <Box 
                flex={1} 
                p={{ base: 4, md: 8 }} 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
            >
                <Box width={{ base: "100%", md: "80%", lg: "60%" }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <VStack spacing={4} align="stretch">
                            <Text 
                                fontSize={{ base: "2xl", md: "3xl" }} 
                                fontWeight="bold" 
                                mb={3}
                                textAlign={{ base: "center", md: "left" }}
                            >
                                Login
                            </Text>
                            <FloatingLabelInput
                                label="Email"
                                register={register}
                                name="email"
                                errors={errors}
                                type="email"
                                rules={{
                                    required: 'Email is required',
                                }}
                            />
                            <FloatingLabelInput
                                label="Password"
                                register={register}
                                name="password"
                                errors={errors}
                                type="password"
                                rules={{ 
                                    required: 'Password is required' 
                                }}
                            />
                            <Button 
                                type="submit" 
                                colorScheme="purple" 
                                width="full" 
                                height="3.5rem"
                                isLoading={isSubmitting}
                                loadingText="Logging in..."
                            >
                                Login
                            </Button>
                            <Text textAlign="center">
                                Don’t have an account? <Link color="blue.500">Sign Up</Link>
                            </Text>
                        </VStack>
                    </form>
                </Box>
            </Box>
        </Flex>
    );
};

export default LoginForm;
