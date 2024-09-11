import React from 'react';
import { Spinner, Box } from '@chakra-ui/react';

const CenteredSpinner = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh" // This makes the Box fill the viewport height
            mt={50} // Margin top
            mb={50} // Margin bottom
        >
            <Spinner size='xl' />
        </Box>
    );
};

export default CenteredSpinner;
