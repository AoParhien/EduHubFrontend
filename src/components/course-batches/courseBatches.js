import { Box, Text } from '@chakra-ui/react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const timeStringToDecimal = (timeString) => {
  if (!timeString.includes(':')) {
    return parseFloat(timeString);
  }

  const [hours, minutes] = timeString.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    console.error(`Invalid time string: ${timeString}`);
    return 0;
  }

  return hours + (minutes / 60);
};

const decimalToTimeString = (decimal) => {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  const minutesFormatted = minutes === 0 ? '00' : minutes;
  return `${hours}:${minutesFormatted}`;
};

const CourseBatches = ({ batches, schedules }) => {
  return (
    <>
      {batches.map((batch, index) => {
        const batchSchedules = schedules.filter(schedule => schedule.batchId === batch._id);

        return (
          <Box key={batch._id} mt={index > 0 ? 4 : 0}>
              <Text fontWeight="bold">
              {batch.batchName}
            </Text>
            {batch.courseTitle && batches.length>1 &&
              <Text fontWeight="bold">
              [{batch.courseTitle}]
            </Text>
            }
            <Text>
              <Text as="span" color="purple.500" whiteSpace="nowrap">
                Start Date: {formatDate(batch.startDate)}
              </Text>
            </Text>

            {batchSchedules.length > 0 ? (
              batchSchedules.map(schedule => {
                const startHour = timeStringToDecimal(schedule.startHour);
                if (isNaN(startHour)) {
                  return <Text key={schedule._id}>Invalid start time</Text>;
                }
                
                const endHour = startHour + schedule.duration;
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