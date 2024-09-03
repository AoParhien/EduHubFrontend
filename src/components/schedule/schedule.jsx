import React, { useRef, useEffect } from 'react';
import { Box, Grid, GridItem, Text, Flex, HStack } from '@chakra-ui/react';


const dayHeight = 70;
const Schedule = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hours = ['12-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12'];
    const batches = [
        { day: 'Wednesday', startHour: '3-4', duration: 2, name: 'Batch A', location: 'ASTC Bahadurabad', color: 'yellow.200' },
        { day: 'Tuesday', startHour: '6-7', duration: 1.5, name: 'Batch B', location: 'ASTC Gulshan', color: 'blue.400' },
        { day: 'Thursday', startHour: '7-8', duration: 2, name: 'Batch A', location: 'ASTC Bahadurabad', color: 'yellow.200' },
        { day: 'Sunday', startHour: '8-9', duration: 2, name: 'Batch B', location: 'ASTC Gulshan', color: 'blue.400' },
    ];

    const scrollRef = useRef(null);
    // const [scrollLeft, setScrollLeft] = useState(0);

    const getBatchForCell = (day, hour) => {
        return batches.find(batch => {
            const startIndex = hours.indexOf(batch.startHour);
            const endIndex = startIndex + batch.duration;
            return batch.day === day && hours.indexOf(hour) >= startIndex && hours.indexOf(hour) < endIndex;
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            // if (scrollRef.current) {
            //     setScrollLeft(scrollRef.current.scrollLeft);
            // }
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