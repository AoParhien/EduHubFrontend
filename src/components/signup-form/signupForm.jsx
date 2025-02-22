import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Checkbox,
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

const SignUpForm = () => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        watch,
        reset,
        setError
    } = useForm({
        mode: 'onTouched',
        defaultValues: {
            role: 'student' // Setting default role as student
        }
    });

    const toast = useToast();
    const authUrl = process.env.REACT_APP_AUTH_SERVICE_URL;

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${authUrl}/api/auth/register`, {
                email: data.email,
                password: data.password,
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName,
                mobileNumber: data.mobileNumber.replace(/^0+/, '') // Remove leading zeros if any
            });

            if (response.data) {
                toast({
                    title: "Account created successfully!",
                    description: "You can now login with your credentials.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                reset();
                // You can redirect to login page here if needed
                // navigate('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            // Handle specific error cases
            if (error.response) {
                const { status, data } = error.response;
                
                switch (status) {
                    case 400:
                        // Handle validation errors from backend
                        if (data.message) {
                            toast({
                                title: "Validation Error",
                                description: data.message,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                            });
                        }
                        // If the API returns field-specific errors
                        if (data.errors) {
                            Object.keys(data.errors).forEach(field => {
                                setError(field, {
                                    type: 'manual',
                                    message: data.errors[field]
                                });
                            });
                        }
                        break;
                        
                    case 409:
                        // Handle duplicate email
                        setError('email', {
                            type: 'manual',
                            message: 'This email is already registered'
                        });
                        break;
                        
                    case 500:
                        toast({
                            title: "Server Error",
                            description: "Unable to create account. Please try again later.",
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
                // Network error
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
            minH="100vh"
        >
            <Box 
                flex={1} 
                display={imageDisplay}
            >
                <Image
                    src="https://as1.ftcdn.net/v2/jpg/01/75/84/48/1000_F_175844887_q9693JpeyWzJikA7xSKdMLwKgzdGHaEx.jpg"
                    alt="Sign Up Image"
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
                                Sign Up
                            </Text>
                            <HStack spacing={4} flexWrap="wrap">
                                <FloatingLabelInput
                                    label="First Name"
                                    register={register}
                                    name="firstName"
                                    errors={errors}
                                    rules={{ 
                                        required: 'First name is required',
                                        minLength: { value: 2, message: 'Minimum 2 characters' }
                                    }}
                                    flex={{ base: "100%", md: "48%" }}
                                />
                                <FloatingLabelInput
                                    label="Last Name"
                                    register={register}
                                    name="lastName"
                                    errors={errors}
                                    rules={{ 
                                        required: 'Last name is required',
                                        minLength: { value: 2, message: 'Minimum 2 characters' }
                                    }}
                                    flex={{ base: "100%", md: "48%" }}
                                />
                            </HStack>
                            <FloatingLabelInput
                                label="Email"
                                register={register}
                                name="email"
                                errors={errors}
                                type="email"
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                }}
                            />
                            <FloatingLabelInput
                                label="Mobile Number"
                                register={register}
                                name="mobileNumber"
                                errors={errors}
                                type="tel"
                                leftAddon="+92"
                                rules={{
                                    required: 'Mobile number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Please enter a valid 10-digit number'
                                    }
                                }}
                            />
                            <FloatingLabelInput
                                label="Password"
                                register={register}
                                name="password"
                                errors={errors}
                                type="password"
                                rules={{ 
                                    required: 'Password is required', 
                                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                                    }
                                }}
                            />
                            <FloatingLabelInput
                                label="Confirm Password"
                                register={register}
                                name="confirmPassword"
                                errors={errors}
                                type="password"
                                rules={{
                                    required: 'Please confirm your password',
                                    validate: (val) => watch('password') === val || "Passwords do not match"
                                }}
                            />
                            <FormControl isInvalid={errors.termsAccepted}>
                                <Checkbox
                                    {...register('termsAccepted', {
                                        required: 'You must accept the terms and conditions'
                                    })}
                                >
                                    By signing up you accept the <Link color="blue.500">Terms of Service</Link> and{" "}
                                    <Link color="blue.500">Privacy Policy</Link>
                                </Checkbox>
                                <FormErrorMessage>
                                    {errors.termsAccepted?.message}
                                </FormErrorMessage>
                            </FormControl>
                            <Button 
                                type="submit" 
                                bg="#00308F" 
                                color="white" 
                                _hover={{ bg: "colors.brand.600" }} 
                                _active={{ bg: "brand.700" }}
                                width="full" 
                                height="3.5rem"
                                isLoading={isSubmitting}
                                loadingText="Logging in..."
                            >
                                Sign Up
                            </Button>
                            <Text textAlign="center">
                                Already have an account? <Link color="blue.500">Login</Link>
                            </Text>
                        </VStack>
                    </form>
                </Box>
            </Box>
        </Flex>
    );
};

export default SignUpForm;
