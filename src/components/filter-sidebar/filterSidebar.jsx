import React, { useState, useEffect } from 'react';
import { Box, Text, Input, VStack, Checkbox, Stack, Divider, Button, Select } from '@chakra-ui/react';

const locations = Array.from({ length: 200 }, (_, i) => `Location ${i + 1}`);
const boards = ['O Levels', 'A Levels', 'SAT'];

const FilterSidebar = ({ onFilterChange, initialFilters }) => {
    const [localFilters, setLocalFilters] = useState(initialFilters);
    const [searchQuery, setSearchQuery] = useState('');
    const [institutes, setInstitutes] = useState([{ name: 'Any' }]);
    const [subjects, setSubjects] = useState(['Any']);

    useEffect(() => {
        setLocalFilters(initialFilters);
    }, [initialFilters]);

    const handleChange = (name, value) => {
        const updatedFilters = { ...localFilters, [name]: value };
        setLocalFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const handleFeeChange = (e) => {
        const { name, value } = e.target;
        const updatedFees = { ...localFilters.fees, [name]: Number(value) };
        const updatedFilters = { ...localFilters, fees: updatedFees };
        setLocalFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    const handleBoardChange = (board) => {
        const updatedBoards = localFilters.board.includes(board)
            ? localFilters.board.filter((b) => b !== board)
            : [...localFilters.board, board];
        handleChange('board', updatedBoards);
    };

    const filteredLocations = locations.filter(location =>
        location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getSubjects = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/courses/getSubjects', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSubjects((prevSubjects) => [...prevSubjects, ...data]);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const getInstitutes = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/institutes/getInstituteNames', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setInstitutes((prevInstitutes) => [...prevInstitutes, ...data]);
        } catch (error) {
            console.error('Error fetching institutes:', error);
        }
    };

    useEffect(() => {
        getSubjects();
        getInstitutes();
    }, []);

    return (
        <Box width="100%" maxWidth="250px" p="2" bg="white" boxShadow="md" borderRadius="sm" overflowY="auto">
            <VStack align="start" spacing={3}>
                {/* Institute Filter */}
                <Box>
                    <Text fontWeight="600" fontSize="0.9rem" mb="1">Institute</Text>
                    <VStack align="start" spacing={1}>
                        {institutes.map((institute) => (
                            <Button
                                key={institute.name} // Ensure key is unique, use a unique property
                                variant="ghost"
                                size="xs"
                                onClick={() => handleChange('institute', institute.name)}
                                fontWeight={institute.name === localFilters.institute ? 'bold' : 'normal'}
                            >
                                {institute.name}
                            </Button>
                        ))}
                    </VStack>
                </Box>

                <Divider />

                {/* Subject Filter */}
                <Box>
                    <Text fontWeight="600" fontSize="0.9rem" mb="1">Subject</Text>
                    <VStack align="start" spacing={1}>
                        {subjects.map((subject, index) => (
                            <Button
                                key={subject || index} // Use subject or index as key
                                variant="ghost"
                                size="xs"
                                onClick={() => handleChange('subject', subject)}
                                fontWeight={subject === localFilters.subject ? 'bold' : 'normal'}
                            >
                                {subject}
                            </Button>
                        ))}
                    </VStack>
                </Box>

                <Divider />

                {/* Location Filter */}
                <Box>
                    <Text fontWeight="600" fontSize="0.9rem" mb="1">Location</Text>
                    <Input
                        placeholder="Search locations"
                        size="xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Select
                        placeholder="Select location"
                        size="xs"
                        mt="2"
                        value={localFilters.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                    >
                        {filteredLocations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </Select>
                </Box>

                <Divider />

                {/* Fees Filter */}
                <Box>
                    <Text fontWeight="600" fontSize="0.9rem" mb="1">Fees</Text>
                    <Stack direction="row" spacing={2}>
                        <Input
                            placeholder="Min"
                            type="number"
                            value={localFilters.fees.min}
                            onChange={handleFeeChange}
                            name="min"
                            size="xs"
                            width="60px"
                        />
                        <Input
                            placeholder="Max"
                            type="number"
                            value={localFilters.fees.max}
                            onChange={handleFeeChange}
                            name="max"
                            size="xs"
                            width="60px"
                        />
                    </Stack>
                </Box>

                <Divider />

                {/* Board Filter */}
                <Box>
                    <Text fontWeight="600" fontSize="0.9rem" mb="1">Board</Text>
                    <VStack align="start" spacing={1}>
                        {boards.map((board) => (
                            <Checkbox
                                key={board}
                                isChecked={localFilters.board.includes(board)}
                                onChange={() => handleBoardChange(board)}
                                size="sm"
                                colorScheme="teal"
                            >
                                {board}
                            </Checkbox>
                        ))}
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default FilterSidebar;
