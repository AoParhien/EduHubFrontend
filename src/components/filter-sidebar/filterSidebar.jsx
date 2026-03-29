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

const dedupeStrings = (values = []) => [...new Set(values.filter(Boolean))];

const dedupeInstitutes = (values = []) => {
  const seen = new Set();

  return values.filter((item) => {
    const name = item?.name?.trim();

    if (!name || seen.has(name)) {
      return false;
    }

    seen.add(name);
    return true;
  });
};

const FilterSidebar = ({ onFilterChange, initialFilters, isMobile, onClose }) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [institutes, setInstitutes] = useState([{ name: 'Any' }]);
  const [subjects, setSubjects] = useState(['Any']);
  const [feeTooltip, setFeeTooltip] = useState(false);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    let isActive = true;

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

        if (!isActive) {
          return;
        }

        setSubjects(['Any', ...dedupeStrings(subjectsData)]);
        setInstitutes([{ name: 'Any' }, ...dedupeInstitutes(institutesData)]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
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

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      institute: 'Any',
      subject: 'Any',
      fees: { min: 0, max: 15000 },
      board: [],
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Box 
      width={isMobile ? "100%" : "300px"} 
      bg="white" 
      borderRadius={isMobile ? "0" : "lg"} 
      boxShadow={isMobile ? "none" : "xl"} 
      p={4} 
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: isMobile ? "none" : "2xl"
      }}
      mb={5}
      className="eduhub__filter-sidebar"
    >
      {isMobile && (
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4} 
          pb={2} 
          borderBottom="1px solid" 
          borderColor="gray.200"
        >
          <Text fontWeight="bold" fontSize="lg">Filter Courses</Text>
          <Button size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </Box>
      )}

      <Accordion 
        defaultIndex={isMobile ? [] : [0]} 
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
            <VStack align="start" spacing={2} maxH={isMobile ? "150px" : "auto"} overflowY="auto">
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
            <VStack align="start" spacing={2} maxH={isMobile ? "150px" : "auto"} overflowY="auto">
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

      {isMobile && (
        <Box 
          display="flex" 
          justifyContent="space-between" 
          mt={6} 
          pt={3} 
          borderTop="1px solid" 
          borderColor="gray.200"
          position="sticky"
          bottom={0}
          bg="white"
          pb={2}
        >
          <Button 
            variant="outline" 
            colorScheme="gray" 
            size="md" 
            width="48%"
            onClick={handleResetFilters}
          >
            Reset
          </Button>
          <Button 
            colorScheme="blue" 
            size="md" 
            width="48%"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FilterSidebar;
