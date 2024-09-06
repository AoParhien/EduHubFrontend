import React, { useState } from 'react';
import { Box, Text, Input, VStack, RadioGroup, Radio, Stack, Divider, Button, Select } from '@chakra-ui/react';

// Sample data
const institutes = ['Any', 'Harvard', 'MIT'];
const subjects = ['Mathematics', 'Physics', 'Chemistry'];
const locations = Array.from({ length: 200 }, (_, i) => `Location ${i + 1}`); // Example of many locations
const boards = ['O Levels', 'A Levels', 'SAT'];

const FilterSidebar = ({ onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({
    institute: 'Any',
    subject: 'Any',
    location: 'Any',
    fees: { min: 0, max: 15000 },
    board: ''
  });

  const handleChange = (name, value) => {
    const updatedFilters = { ...localFilters, [name]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleFeeChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      fees: { ...prev.fees, [name]: value },
    }));
    onFilterChange({ ...localFilters, fees: { ...localFilters.fees, [name]: value } });
  };

  // Filtering locations based on user input
  const [searchQuery, setSearchQuery] = useState('');
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box width="100%" maxWidth="250px" p="2" bg="white" boxShadow="md" borderRadius="sm" overflowY="auto">
      <VStack align="start" spacing={3}>
        {/* Institute Filter */}
        <Box>
          <Text fontWeight="600" fontSize="0.9rem" mb="1">Institute</Text>
          <VStack align="start" spacing={1}>
            {institutes.map((institute) => (
              <Button
                key={institute}
                variant="ghost"
                size="xs"
                onClick={() => handleChange('institute', institute)}
                fontWeight={institute === localFilters.institute ? 'bold' : 'normal'}
              >
                {institute}
              </Button>
            ))}
          </VStack>
        </Box>

        <Divider />

        {/* Subject Filter */}
        <Box>
          <Text fontWeight="600" fontSize="0.9rem" mb="1">Subject</Text>
          <VStack align="start" spacing={1}>
            {subjects.map((subject) => (
              <Button
                key={subject}
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
          <RadioGroup onChange={(value) => handleChange('board', value)} value={localFilters.board}>
            <VStack align="start" spacing={1}>
              {boards.map((board) => (
                <Radio key={board} value={board} size="sm" colorScheme="teal">
                  {board}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        </Box>
      </VStack>
    </Box>
  );
};

const App = () => (
  <Box display="flex" gap="4">
    {/* Compact Filter Sidebar */}
    <FilterSidebar onFilterChange={(filters) => console.log(filters)} />

    
  </Box>
);

export default App;
