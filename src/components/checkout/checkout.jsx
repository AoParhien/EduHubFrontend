import React, { useState, useEffect } from 'react';
import { List, ListItem, ListIcon } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Select,
    Text,
    Image,
    VStack,
    HStack,
    Divider,
    useToast,
} from "@chakra-ui/react";
import CenteredSpinner from '../centered-spinner/centeredSpinner';
import harvard from '../../assets/harvard.svg';
import Schedule from '../schedule/schedule';
import useUserStore from '../../store/useUserStore';

const BatchSelector = ({ batches, selectedBatch, handleBatchChange }) => {
    return (
        <FormControl>
            <FormLabel htmlFor="batch">Select Batch</FormLabel>
            <Select id="batch" value={selectedBatch} onChange={handleBatchChange}>
                {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                        {batch.batchName}
                    </option>
                ))}
            </Select>
        </FormControl>
    );
};


const Checkout = () => {
    const [selectedBatch, setSelectedBatch] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const toast = useToast();
    const { user } = useUserStore();
    useEffect(() => {
        if (location.state && location.state.course) {
            setCourse(location.state.course);
            setSelectedBatch(location.state.course.batches[0]._id)
        } else {
            navigate('/courses', { replace: true });
        }
    }, [location, navigate]);

    if (!course) {
        return <CenteredSpinner />;
    }

    const handleBatchChange = (e) => {
        console.log(e.target.value)
        setSelectedBatch(e.target.value);
    };

    const handleCheckout = async () => {

        if(!user){
            toast({
                title: "Invalid User",
                description: "Please login to enroll",
                status: "error",
                duration: 5000,
                isClosable: true,
            });            
            return
        }
        const payload = {
            batchId: selectedBatch,
            studentId: user.student._id
        };

        try {
            const apiUrl = process.env.REACT_APP_REGISTRATION_SERVICE_URL;
            const response = await fetch(`${apiUrl}/api/enrollment/addEnrollment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            if (response.ok) {
                toast({
                    title: "Registration Successful",
                    description: "You have been successfully enrolled.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                throw new Error("Registration failed");
            }
        } catch (error) {
            toast({
                title: "Registration Failed",
                description: "There was an error during registration. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const totalFees = course.institute.registrationFees + course.fees;

    return (
        <Box minHeight="100vh" py={8}>
            <VStack spacing={6} align="stretch" maxWidth="1200px" margin="auto" px={4}>
                <Heading as="h1" size="xl" textAlign="center">
                    Complete Your Enrollment
                </Heading>
                <Text fontSize="md" textAlign="center" color="gray.600">
                    You're one step away from starting your journey in {course.title} with {course.teacher.name}
                </Text>
                <Box p={3} bg="yellow.100" borderRadius="md" border="1px solid" borderColor="yellow.300">
                    <Text fontSize="sm" color="yellow.800" textAlign="center">
                        Important: You will be required to pay this fee on the first day of class at the institute.
                    </Text>
                </Box>

                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                    {/* Course Details Section */}
                    <Box
                        flex={1}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        border="1px solid"
                        borderColor="gray.200"
                        overflow="hidden"
                    >
                        <VStack align="stretch" spacing={0}>
                            <Box bg="#00308F" color="white" p={4}>
                                <Heading as="h2" size="md">
                                    Course Details
                                </Heading>
                            </Box>
                            <VStack align="stretch" spacing={4} p={4}>
                                <HStack>
                                    <Image
                                        src={harvard}
                                        alt="Harvard Logo"
                                        boxSize="40px"
                                    />
                                    <Text fontWeight="bold" fontSize="20px">
                                        {course.title}
                                    </Text>
                                </HStack>

                                <BatchSelector 
                                    batches={course.batches} 
                                    selectedBatch={selectedBatch} 
                                    handleBatchChange={handleBatchChange} 
                                />

                                <Box>
                                    <Heading as="h3" size="sm" mb={2}>
                                        Class Schedule
                                    </Heading>
                                    <Schedule batches={course.batches} schedules={course.schedules} />
                                </Box>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Order Summary Section */}
                    <Box
                        width={{ base: "100%", md: "350px" }}
                        bg="white"
                        borderRadius="lg"
                        boxShadow="md"
                        border="1px solid"
                        borderColor="gray.200"
                        overflow="hidden"
                    >
                        <VStack align="stretch" spacing={0}>
                            <Box bg="#00308F" color="white" p={4}>
                                <Heading as="h2" size="md">
                                    Order Summary
                                </Heading>
                            </Box>
                            <VStack align="stretch" spacing={4} p={4}>
                                <Text fontWeight="bold">Course: {course.title}</Text>
                                <Text>Instructor: Sir {course.teacher.name}</Text>
                                <Text>Duration: {course.durationMonths} months</Text>
                                <Divider />
                                <VStack align="stretch" spacing={2}>
                                    <Flex justify="space-between">
                                        <Text>Tuition Fee:</Text>
                                        <Text fontWeight="bold">Rs {course.fees}</Text>
                                    </Flex>
                                    <Flex justify="space-between">
                                        <Text>Registration Fee:</Text>
                                        <Text fontWeight="bold">Rs {course.institute.registrationFees}</Text>
                                    </Flex>
                                    <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                                        <Text>Total:</Text>
                                        <Text>Rs {totalFees}</Text>
                                    </Flex>
                                </VStack>
                                <Divider />
                                <VStack align="stretch" spacing={2}>
                                    <Text fontWeight="bold">What's Included:</Text>
                                    <List spacing={1}>
                                        <ListItem>
                                            <ListIcon as={CheckCircleIcon} color="green.500" />
                                            Live onsite classes
                                        </ListItem>
                                        <ListItem>
                                            <ListIcon as={CheckCircleIcon} color="green.500" />
                                            Study materials
                                        </ListItem>
                                        <ListItem>
                                            <ListIcon as={CheckCircleIcon} color="green.500" />
                                            Practice tests
                                        </ListItem>
                                        <ListItem>
                                            <ListIcon as={CheckCircleIcon} color="green.500" />
                                            1-on-1 doubt clearing sessions
                                        </ListItem>
                                    </List>
                                </VStack>
                                <Button
                                    type="submit"
                                    size="lg"
                                    w="full"
                                    bg={"#F6D33C"}
                                    onClick={handleCheckout}
                                >
                                    Confirm Purchase
                                </Button>
                                <Text fontSize="sm" color="gray.600" textAlign="center">
                                    By confirming, you agree to our Terms of Service and Privacy Policy.
                                </Text>
                            </VStack>
                        </VStack>
                    </Box>
                </Flex>
            </VStack>
        </Box>
    );
};

export default Checkout;
