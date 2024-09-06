import React, { useState } from 'react';
import { Box, Text, Collapse, Button, Input, VStack, RadioGroup, Radio } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

// Sample data
const institutes = ['Any', 'Harvard', 'MIT'];
const subjects = ['Mathematics', 'Physics', 'Chemistry'];
const locations = ['Saddar, Karachi', 'Gulshan, Karachi', 'DHA, Karachi'];
const boards = ['O Levels', 'A Levels', 'SAT'];

const FilterSidebar = ({ onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({
    institute: '',
    location: '',
    fees: '',
    board: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...localFilters, [name]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const [isInstituteOpen, setInstituteOpen] = useState(false);
  const [isSubjectOpen, setSubjectOpen] = useState(false);
  const [isLocationOpen, setLocationOpen] = useState(false);

  const [selectedInstitute, setSelectedInstitute] = useState('Any');
  const [selectedSubject, setSelectedSubject] = useState('Any');
  const [selectedLocation, setSelectedLocation] = useState('Any');
  const [minFee, setMinFee] = useState(0);
  const [maxFee, setMaxFee] = useState(15000);
  const [selectedBoard, setSelectedBoard] = useState('');

  const handleCollapseSelect = (type, value) => {
    switch (type) {
      case 'institute':
        setSelectedInstitute(value);
        setInstituteOpen(false);
        break;
      case 'subject':
        setSelectedSubject(value);
        setSubjectOpen(false);
        break;
      case 'location':
        setSelectedLocation(value);
        setLocationOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <Box width="100%" maxWidth="300px" p="2" bg="white" boxShadow="lg" borderRadius="md" overflowY="auto">
      {/* Institute Filter */}
      <Box marginBottom="1rem" borderBottom="1px solid" borderBottomColor="gray.500">
        <Button variant="link" onClick={() => setInstituteOpen(!isInstituteOpen)} width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontWeight="500" fontSize="1.1rem">Institute</Text>
          <ChevronDownIcon transform={isInstituteOpen ? 'rotate(180deg)' : 'rotate(0deg)'} />
        </Button>
        <Collapse in={isInstituteOpen} animateOpacity>
          <VStack align="start" marginTop="0.5rem">
            {institutes.map((institute) => (
              <Button key={institute} variant="ghost" onClick={() => handleCollapseSelect('institute', institute)} fontWeight={institute === selectedInstitute ? 'bold' : 'normal'}>
                {institute}
              </Button>
            ))}
          </VStack>
        </Collapse>
        {!isInstituteOpen && <Text mt="8px" fontSize="1rem">{selectedInstitute}</Text>}
      </Box>

      {/* Subject Filter */}
      <Box marginBottom="1.8rem" borderBottom="1px solid" borderBottomColor="gray.500">
        <Button variant="link" onClick={() => setSubjectOpen(!isSubjectOpen)} width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontWeight="500" fontSize="1.1rem">Subject</Text>
          <ChevronDownIcon transform={isSubjectOpen ? 'rotate(180deg)' : 'rotate(0deg)'} />
        </Button>
        <Collapse in={isSubjectOpen} animateOpacity>
          <VStack align="start" marginTop="0.5rem">
            {subjects.map((subject) => (
              <Button key={subject} variant="ghost" onClick={() => handleCollapseSelect('subject', subject)} fontWeight={subject === selectedSubject ? 'bold' : 'normal'}>
                {subject}
              </Button>
            ))}
          </VStack>
        </Collapse>
        {!isSubjectOpen && <Text mt="8px" fontSize="1rem">{selectedSubject}</Text>}
      </Box>

      {/* Location Filter */}
      <Box marginBottom="1rem" borderBottom="1px solid" borderBottomColor="gray.500">
        <Button variant="link" onClick={() => setLocationOpen(!isLocationOpen)} width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontWeight="500" fontSize="1.1rem">Location</Text>
          <ChevronDownIcon transform={isLocationOpen ? 'rotate(180deg)' : 'rotate(0deg)'} />
        </Button>
        <Collapse in={isLocationOpen} animateOpacity>
          <VStack align="start" marginTop="0.5rem">
            {locations.map((location) => (
              <Button key={location} variant="ghost" onClick={() => handleCollapseSelect('location', location)} fontWeight={location === selectedLocation ? 'bold' : 'normal'}>
                {location}
              </Button>
            ))}
          </VStack>
        </Collapse>
        {!isLocationOpen && <Text mt="8px" fontSize="1rem">{selectedLocation}</Text>}
      </Box>

      {/* Fees Filter */}
      <Box marginBottom="1rem" borderBottom="1px solid" borderBottomColor="gray.500">
        <Text fontWeight="bold" fontSize="lg">Fees</Text>
        <Box display="flex" gap="1rem" marginTop="0.5rem">
          <Input placeholder="Min" type="number" value={minFee} onChange={(e) => setMinFee(e.target.value)} />
          <Input placeholder="Max" type="number" value={maxFee} onChange={(e) => setMaxFee(e.target.value)} />
        </Box>
      </Box>

      {/* Board Filter */}
      <Box marginBottom="1rem" borderBottom="1px solid" borderBottomColor="gray.500">
        <Text fontWeight="500" fontSize="1.1rem" mb="0.5rem">Board</Text>
        <Box>
          <RadioGroup onChange={(value) => setSelectedBoard(value)} value={selectedBoard}>
            <VStack align="start" spacing={2}>
              {boards.map((board) => (
                <Radio key={board} value={board} size="lg" colorScheme="teal" borderColor="gray.300">
                  {board}
                </Radio>
              ))}
            </VStack>
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
};

const App = () => (
  <Box display="flex" gap="4">
    <FilterSidebar onFilterChange={(filters) => console.log(filters)} />
  </Box>
);

export default App;
