import { Box, Text } from '@chakra-ui/react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Function to convert time string to decimal hour (e.g., "3:30" to 3.5)
const timeStringToDecimal = (timeString) => {
  if (!timeString.includes(':')) {
    // If the time is given as a single number, convert directly to decimal
    return parseFloat(timeString);
  }

  const [hours, minutes] = timeString.split(':').map(Number);

  // Check if hours and minutes are valid numbers
  if (isNaN(hours) || isNaN(minutes)) {
    console.error(`Invalid time string: ${timeString}`);
    return 0; // Fallback value if parsing fails
  }

  return hours + (minutes / 60);
};

// Function to format decimal hours to time string (e.g., 3.5 to "3:30")
const decimalToTimeString = (decimal) => {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  
  // Ensure minutes are formatted as "00" or "30"
  const minutesFormatted = minutes === 0 ? '00' : minutes;

  return `${hours}:${minutesFormatted}`;
};

const CourseBatches = ({ batches, schedules }) => {
  return (
    <>
      {batches.map((batch, index) => {
        // Filter schedules that belong to the current batch
        const batchSchedules = schedules.filter(schedule => schedule.batchId === batch._id);

        return (
          <Box key={batch._id} mt={index > 0 ? 4 : 0}>
            <Text fontWeight="bold">{batch.batchName}</Text>
            <Text>
              <Text as="span" color="purple.500" whiteSpace="nowrap">
                Start Date: {formatDate(batch.startDate)}
              </Text>
            </Text>

            {batchSchedules.length > 0 ? (
              batchSchedules.map(schedule => {
                // Ensure startHour is parsed correctly
                const startHour = timeStringToDecimal(schedule.startHour);
                if (isNaN(startHour)) {
                  return <Text key={schedule._id}>Invalid start time</Text>;
                }
                
                // Add the duration to the start hour
                const endHour = startHour + schedule.duration;

                // Convert decimal hours back to time string
                const startTime = decimalToTimeString(startHour);
                const endTime = decimalToTimeString(endHour);

                return (
                  <Text key={schedule._id}>
                    {schedule.day}: {startTime} - {endTime}
                  </Text>
                );
              })
            ) : (
              <Text>No schedules available</Text>
            )}
          </Box>
        );
      })}
    </>
  );
};

export default CourseBatches;
