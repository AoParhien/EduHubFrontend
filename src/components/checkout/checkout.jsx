import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Select,
    Stack,
    Text,
    Image,
    Spacer
} from "@chakra-ui/react";
import harvard from '../../assets/harvard.svg'

const Checkout = () => {
    return (
        <Flex justify="center" align="center" minHeight="100vh">
            <Flex gap={20} mb={10} maxWidth="1000px" mt={-100}>
                <Box
                    background="white"
                    px={10}
                    py={10}
                    width={700}
                    borderRadius="10px"
                    boxShadow="lg"
                >
                    <Stack spacing={4} height="full">
                        <Stack>
                            <Heading as="h1" size="xl" fontWeight="bold">
                                Checkout
                            </Heading>
                            <Text color="black.600" fontSize={20} fontWeight="600" mt={6}>
                                Course Details :
                            </Text>
                            <Flex>
                                <Image
                                    src={harvard}
                                    alt="Harvard Logo"
                                    maxWidth="70px"
                                    marginRight="0.5rem"
                                />
                                <Text mt={5} fontSize={16}>
                                    Olevel Mathematics By Sir Ahmed Saya
                                </Text>
                            </Flex>
                        </Stack>

                        <Flex align="center">
                            <Card w="full" maxWidth={500}>
                                <CardBody>
                                    <Stack>
                                        <FormControl>
                                            <FormLabel htmlFor="batch">Select Batch</FormLabel>
                                            <Select id="batch" defaultValue="batch1" placeholder="Select Batch">
                                                <option value="batch1">Batch 1 (Jan-Mar)</option>
                                                <option value="batch2">Batch 2 (Apr-Jun)</option>
                                                <option value="batch3">Batch 3 (Jul-Sep)</option>
                                                <option value="batch4">Batch 4 (Oct-Dec)</option>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </CardBody>
                                <Divider />
                            </Card>
                        </Flex>

                        <Spacer /> {/* Pushes the text to the bottom */}

                        <Text fontSize={10}>
                            *You will have to pay this fee on the first day of class at the institute
                        </Text>
                    </Stack>
                </Box>

                <Card width={400} background="white-smoke" mt={8} maxHeight={250}>
                    <CardHeader>
                        <Heading as="h2" size="md">
                            Order Summary
                        </Heading>
                    </CardHeader>
                    <CardBody>
                        <Flex align="center" justify="space-between">
                            <Heading as="h3" size="sm" fontWeight="semibold">
                                Total Price:
                            </Heading>
                            <Text fontSize="2xl" fontWeight="bold">
                                Rs 4500
                            </Text>
                        </Flex>
                    </CardBody>
                    <CardFooter>
                        <Button type="submit" size="lg" w="full" background="#362AC1" color="white">
                            Confirm Purchase
                        </Button>
                    </CardFooter>
                </Card>
            </Flex>
        </Flex>

    );
}

export default Checkout