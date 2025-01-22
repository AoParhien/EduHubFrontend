import React, { useRef, useEffect } from 'react';
import { Box, Grid, GridItem, Text, Flex, HStack } from '@chakra-ui/react';

const dayHeight = 70;


const Schedule = ({ batches, schedules }) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const hours = ['12-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12'];

    const mergeBatchesAndSchedules = (batches, schedules) => {
        console.log(batches, schedules)
        return batches.map(batch => {
            // Find the schedules related to this batch
            const relatedSchedules = schedules.filter(schedule => schedule.batchId === batch._id);

            // Convert schedules to desired format, extracting details
            return relatedSchedules.map(schedule => ({
                day: schedule.day,
                startHour: schedule.startHour,
                duration: schedule.duration,
                name: batch.batchName,  // Mapping batch name to your previous `name` field
                location: '', // Set your location as needed
                color: 'yellow.200' // Assign a default color if not specified
            }));
        }).flat(); // Flatten the array if necessary
    };

    const convertedBatches = mergeBatchesAndSchedules(batches, schedules);

    const scrollRef = useRef(null);

    const getBatchForCell = (day, hour) => {
        return convertedBatches.find(batch => {
            const startIndex = hours.indexOf(batch.startHour);
            const durationDecimal = parseFloat(batch.duration);
            const endIndex = startIndex + durationDecimal;
            return batch.day === day && hours.indexOf(hour) >= startIndex && hours.indexOf(hour) < endIndex;
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            // Handling scroll for future use
        };

        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" m={4} maxWidth={1100}>
            <Grid templateColumns="auto 1fr" gap={0}>
                <GridItem>
                    <Box height="50px" borderBottomWidth="1px" />
                    {days.map((day) => (
                        <Box key={day} p={2} borderRightWidth="1px" borderBottomWidth="1px" height={`${dayHeight}px`}>
                            <Text fontSize="sm">{day}</Text>
                        </Box>
                    ))}
                </GridItem>
                <GridItem overflowX="auto" ref={scrollRef}>
                    <HStack spacing={0} width={`${hours.length * 100}px`} position="relative">
                        {hours.map((hour) => (
                            <Box key={hour} p={3} textAlign="center" borderRightWidth="1px" borderBottomWidth="1px" width="100px" flexShrink={0} height="50px">
                                <Text fontSize="sm">{hour}</Text>
                            </Box>
                        ))}
                    </HStack>
                    {days.map((day) => (
                        <Flex key={day} width={`${hours.length * 100}px`} height={`${dayHeight}px`} borderBottomWidth="1px">
                            {hours.map((hour) => {
                                const batch = getBatchForCell(day, hour);
                                const isStart = batch && batch.startHour === hour;
                                return (
                                    <Box key={`${day}-${hour}`} p={2} borderRightWidth="1px" width="100px" flexShrink={0}>
                                        {isStart && (
                                            <Box
                                                bg={batch.color}
                                                p={1}
                                                borderRadius="md"
                                                width={`${batch.duration * 100 - 16}px`}
                                                color={batch.color === 'blue.400' ? 'white' : 'black'}
                                                display="flex"                  // Add flex display
                                                flexDirection="column"          // Stack items vertically
                                                alignItems="center"             // Center items horizontally
                                                justifyContent="center"         // Center items vertically
                                                textAlign="center"              // Center the text inside the items
                                            >
                                                <Text fontWeight="bold">{batch.name}</Text>
                                                <Text fontSize="xs">{batch.location}</Text>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Flex>
                    ))}
                </GridItem>
            </Grid>
        </Box>
    );
};

export default Schedule;
