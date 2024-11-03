import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';

const FeeTable = ({ registrationFees, courseFees }) => {
    const totalFees = registrationFees + courseFees;
    return (
        <TableContainer alignItems='center' fontSize={20} color='black.500'>
            <Table variant="simple" width={800} align='center' mt={10}>
                <Thead>
                    <Tr>
                        <Th fontSize={20} color={'black'}>Fee Type</Th>
                        <Th fontSize={20} color={'black'}>Amount</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Registration Fee</Td>
                        <Td>Rs. {registrationFees}</Td>
                    </Tr>
                    <Tr>
                        <Td>Tuition Fee</Td>
                        <Td>Rs. {courseFees}</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>Total</Td>
                        <Td>Rs. {totalFees}</Td>
                        <Td></Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default FeeTable;