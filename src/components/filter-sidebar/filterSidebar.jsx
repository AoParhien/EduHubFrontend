import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  Checkbox, 
  Button, 
  Select, 
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip
} from '@chakra-ui/react';

const locations = Array.from({ length: 200 }, (_, i) => `Location ${i + 1}`);
const boardMapping = {
  "O Levels": "olevels",
  "A Levels": "alevels",
  "Intermediate": "intermediate",
  "Matric": "matric",
  "SAT": "sat"
};

const boards = Object.keys(boardMapping);

const FilterSidebar = ({ onFilterChange, initialFilters }) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [institutes, setInstitutes] = useState([{ name: 'Any' }]);
  const [subjects, setSubjects] = useState(['Any']);
  const [feeTooltip, setFeeTooltip] = useState(false);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_INSTITUTE_SERVICE_URL;
        const subjectsResponse = await fetch(`${apiUrl}/api/courses/getSubjects`, {
          method: 'GET',
          credentials: 'include',
        });
        const institutesResponse = await fetch(`${apiUrl}/api/institutes/getInstituteNames`, {
          method: 'GET',
          credentials: 'include',
        });

        const subjectsData = await subjectsResponse.json();
        const institutesData = await institutesResponse.json();

        setSubjects((prev) => [...prev, ...subjectsData]);
        setInstitutes((prev) => [...prev, ...institutesData]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (name, value) => {
    const updatedFilters = { ...localFilters, [name]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleBoardChange = (board) => {
    const mappedValue = boardMapping[board];
    let updatedBoards;
    
    if (Array.isArray(localFilters.board)) {
      updatedBoards = localFilters.board.includes(mappedValue)
        ? localFilters.board.filter((b) => b !== mappedValue)
        : [...localFilters.board, mappedValue];
    } else {
      updatedBoards = [mappedValue];
    }

    handleChange("board", updatedBoards);
  };

  const handleFeeChange = (value) => {
    const updatedFees = { 
      ...localFilters.fees, 
      max: value 
    };
    const updatedFilters = { ...localFilters, fees: updatedFees };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Box 
      width="300px" 
      bg="white" 
      borderRadius="lg" 
      boxShadow="xl" 
      p={4} 
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "2xl"
      }}
    >
      <Accordion 
        defaultIndex={[0]} 
        allowMultiple 
        borderColor="transparent"
      >
        {/* Institute Filter */}
        <AccordionItem borderTop="none" borderBottom="1px solid" borderColor="gray.100">
          <AccordionButton 
            _hover={{ bg: "gray.50" }} 
            px={0} 
            py={3}
          >
            <Text 
              flex="1" 
              textAlign="left" 
              fontWeight="bold" 
              color="gray.700"
            >
              Institute
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} pb={4}>
            <VStack align="start" spacing={2}>
              {institutes.map((institute) => (
                <Button
                  key={institute.name}
                  variant={institute.name === localFilters.institute ? "solid" : "ghost"}
                  colorScheme={institute.name === localFilters.institute ? "blue" : "gray"}
                  size="sm"
                  onClick={() => handleChange('institute', institute.name)}
                  width="full"
                  justifyContent="start"
                >
                  {institute.name}
                </Button>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        {/* Subject Filter */}
        <AccordionItem borderTop="none" borderBottom="1px solid" borderColor="gray.100">
          <AccordionButton 
            _hover={{ bg: "gray.50" }} 
            px={0} 
            py={3}
          >
            <Text 
              flex="1" 
              textAlign="left" 
              fontWeight="bold" 
              color="gray.700"
            >
              Subject
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} pb={4}>
            <VStack align="start" spacing={2}>
              {subjects.map((subject, index) => (
                <Button
                  key={subject || index}
                  variant={subject === localFilters.subject ? "solid" : "ghost"}
                  colorScheme={subject === localFilters.subject ? "blue" : "gray"}
                  size="sm"
                  onClick={() => handleChange('subject', subject)}
                  width="full"
                  justifyContent="start"
                >
                  {subject}
                </Button>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        {/* Location Filter */}
        <AccordionItem borderTop="none" borderBottom="1px solid" borderColor="gray.100">
          <AccordionButton 
            _hover={{ bg: "gray.50" }} 
            px={0} 
            py={3}
          >
            <Text 
              flex="1" 
              textAlign="left" 
              fontWeight="bold" 
              color="gray.700"
            >
              Location
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} pb={4}>
            <Select
              placeholder="Select location"
              size="sm"
              value={localFilters.location}
              onChange={(e) => handleChange('location', e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </AccordionPanel>
        </AccordionItem>

        {/* Fees Filter */}
        <AccordionItem borderTop="none" borderBottom="1px solid" borderColor="gray.100">
          <AccordionButton 
            _hover={{ bg: "gray.50" }} 
            px={0} 
            py={3}
          >
            <Text 
              flex="1" 
              textAlign="left" 
              fontWeight="bold" 
              color="gray.700"
            >
              Fees
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} pb={4}>
            <Slider 
              defaultValue={localFilters.fees.max} 
              min={0} 
              max={20000} 
              step={500}
              onChange={handleFeeChange}
              onMouseEnter={() => setFeeTooltip(true)}
              onMouseLeave={() => setFeeTooltip(false)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="blue.500"
                color="white"
                placement="top"
                isOpen={feeTooltip}
                label={`Rs. ${localFilters.fees.max}`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
            <Text mt={2} textAlign="center" fontSize="sm" color="gray.600">
              Max Fee: Rs.{localFilters.fees.max}
            </Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderTop="none" borderBottom="none">
          <AccordionButton _hover={{ bg: "gray.50" }} px={0} py={3}>
            <Text flex="1" textAlign="left" fontWeight="bold" color="gray.700">
              Board
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} pb={4}>
            <VStack align="start" spacing={2}>
              {boards.map((board) => (
                <Checkbox
                  key={board}
                  isChecked={Array.isArray(localFilters.board) && localFilters.board.includes(boardMapping[board])}
                  onChange={() => handleBoardChange(board)}
                  colorScheme="blue"
                  size="md"
                >
                  {board}
                </Checkbox>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default FilterSidebar;