import React, { useEffect, useMemo, useState } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  Checkbox, 
  Button, 
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Flex,
  Badge,
  HStack,
  Divider,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
const boardMapping = {
  "O Levels": "Olevels",
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

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (localFilters?.institute && localFilters.institute !== 'Any') {
      count += 1;
    }

    if (localFilters?.subject && localFilters.subject !== 'Any') {
      count += 1;
    }

    if (Array.isArray(localFilters?.board) && localFilters.board.length > 0) {
      count += localFilters.board.length;
    }

    if (Number(localFilters?.fees?.max ?? 15000) < 15000) {
      count += 1;
    }

    return count;
  }, [localFilters]);

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

  const renderChoiceButton = (label, isSelected, onClick) => (
    <Button
      key={label}
      variant="unstyled"
      onClick={onClick}
      borderWidth="1px"
      borderColor={isSelected ? "blue.500" : "gray.200"}
      bg={isSelected ? "blue.50" : "white"}
      color={isSelected ? "blue.700" : "gray.700"}
      fontWeight={isSelected ? "700" : "600"}
      borderRadius="full"
      px={4}
      py={2}
      minH="42px"
      boxShadow={isSelected ? "0 12px 24px -18px rgba(49, 130, 206, 0.85)" : "none"}
      _hover={{
        borderColor: isSelected ? "blue.500" : "blue.200",
        bg: isSelected ? "blue.50" : "gray.50",
      }}
      _active={{
        transform: "translateY(1px)",
      }}
    >
      {label}
    </Button>
  );

  return (
    <Box 
      width={isMobile ? "100%" : "320px"} 
      bg={isMobile ? "white" : "linear-gradient(180deg, #ffffff 0%, #f7fbff 100%)"} 
      borderRadius={isMobile ? "0" : "28px"} 
      borderWidth={isMobile ? "0" : "1px"}
      borderColor="blue.100"
      boxShadow={isMobile ? "none" : "0 24px 50px -34px rgba(15, 52, 96, 0.35)"} 
      p={{ base: 4, md: 5 }} 
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: isMobile ? "none" : "0 28px 60px -34px rgba(15, 52, 96, 0.42)"
      }}
      mb={5}
      position="relative"
      className="eduhub__filter-sidebar"
    >
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={3}
        mb={4}
      >
        <HStack spacing={2}>
          <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={3} py={1}>
            {activeFilterCount} filters
          </Badge>
        </HStack>
        {isMobile && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={onClose}
          >
            Close
          </Button>
        )}
      </Flex>

      <Divider mb={4} borderColor="blue.100" />

      <Accordion 
        defaultIndex={isMobile ? [0, 1] : [0, 1, 2]} 
        allowMultiple 
        borderColor="transparent"
      >
        <AccordionItem borderTop="none" borderBottom="1px solid" borderColor="blue.50">
          <AccordionButton 
            _hover={{ bg: "blue.50" }} 
            px={1} 
            py={3.5}
            borderRadius="xl"
          >
            <Box flex="1" textAlign="left">
              <Text fontWeight="800" color="gray.800">Institute</Text>
              <Text fontSize="sm" color="gray.500">
                {localFilters.institute === 'Any' ? 'Browse all institutes' : localFilters.institute}
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={1} pb={4}>
            <Wrap spacing={2.5} maxH={isMobile ? "200px" : "260px"} overflowY="auto" pr={2}>
              {institutes.map((institute) => (
                <WrapItem key={institute.name}>
                  {renderChoiceButton(
                    institute.name,
                    institute.name === localFilters.institute,
                    () => handleChange('institute', institute.name)
                  )}
                </WrapItem>
              ))}
            </Wrap>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderTop="none" borderBottom="1px solid" borderColor="blue.50">
          <AccordionButton 
            _hover={{ bg: "blue.50" }} 
            px={1} 
            py={3.5}
            borderRadius="xl"
          >
            <Box flex="1" textAlign="left">
              <Text fontWeight="800" color="gray.800">Subject</Text>
              <Text fontSize="sm" color="gray.500">
                {localFilters.subject === 'Any' ? 'Show every subject' : localFilters.subject}
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={1} pb={4}>
            <Wrap spacing={2.5} maxH={isMobile ? "200px" : "260px"} overflowY="auto" pr={2}>
              {subjects.map((subject, index) => (
                <WrapItem key={subject || index}>
                  {renderChoiceButton(
                    subject,
                    subject === localFilters.subject,
                    () => handleChange('subject', subject)
                  )}
                </WrapItem>
              ))}
            </Wrap>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderTop="none" borderBottom="1px solid" borderColor="blue.50">
          <AccordionButton 
            _hover={{ bg: "blue.50" }} 
            px={1} 
            py={3.5}
            borderRadius="xl"
          >
            <Box flex="1" textAlign="left">
              <Text fontWeight="800" color="gray.800">Fees</Text>
              <Text fontSize="sm" color="gray.500">
                Up to Rs. {Number(localFilters?.fees?.max || 0).toLocaleString()}
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={1} pb={4}>
            <Box
              bg="blue.50"
              borderRadius="2xl"
              px={5}
              py={5}
              borderWidth="1px"
              borderColor="blue.100"
            >
            <Slider 
              value={Number(localFilters?.fees?.max || 0)} 
              min={0} 
              max={20000} 
              step={500}
              onChange={handleFeeChange}
              onMouseEnter={() => setFeeTooltip(true)}
              onMouseLeave={() => setFeeTooltip(false)}
            >
              <SliderTrack>
                <SliderFilledTrack bg="linear-gradient(90deg, #1f6feb 0%, #0d3b66 100%)" />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="blue.600"
                color="white"
                placement="top"
                isOpen={feeTooltip}
                label={`Rs. ${Number(localFilters?.fees?.max || 0).toLocaleString()}`}
              >
                <SliderThumb boxSize={6} borderColor="white" borderWidth="4px" />
              </Tooltip>
            </Slider>
            <Flex justify="space-between" mt={4} color="gray.600" fontSize="sm" fontWeight="600">
              <Text>Rs. 0</Text>
              <Text>Rs. 20,000</Text>
            </Flex>
            </Box>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem borderTop="none" borderBottom="none">
          <AccordionButton _hover={{ bg: "blue.50" }} px={1} py={3.5} borderRadius="xl">
            <Box flex="1" textAlign="left">
              <Text fontWeight="800" color="gray.800">Board</Text>
              <Text fontSize="sm" color="gray.500">
                {Array.isArray(localFilters.board) && localFilters.board.length > 0
                  ? `${localFilters.board.length} board${localFilters.board.length > 1 ? 's' : ''} selected`
                  : 'Select one or more boards'}
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={1} pb={4}>
            <VStack align="start" spacing={3}>
              {boards.map((board) => (
                <Checkbox
                  key={board}
                  isChecked={Array.isArray(localFilters.board) && localFilters.board.includes(boardMapping[board])}
                  onChange={() => handleBoardChange(board)}
                  colorScheme="blue"
                  size="md"
                  width="100%"
                  px={3}
                  py={2.5}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={Array.isArray(localFilters.board) && localFilters.board.includes(boardMapping[board]) ? "blue.200" : "gray.200"}
                  bg={Array.isArray(localFilters.board) && localFilters.board.includes(boardMapping[board]) ? "blue.50" : "white"}
                >
                  {board}
                </Checkbox>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Box 
        display="flex" 
        justifyContent="space-between" 
        mt={6} 
        pt={4} 
        borderTop="1px solid" 
        borderColor="blue.100"
        position={isMobile ? "sticky" : "static"}
        bottom={0}
        bg={isMobile ? "white" : "transparent"}
        pb={isMobile ? 2 : 0}
        gap={3}
      >
        <Button 
          variant="outline" 
          colorScheme="blue" 
          size="md" 
          flex="1"
          borderRadius="xl"
          onClick={handleResetFilters}
        >
          Reset
        </Button>
        {isMobile && (
          <Button 
            colorScheme="blue" 
            size="md" 
            flex="1"
            borderRadius="xl"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        )}
      </Box>

      {isMobile && (
        <Box 
          mt={3}
          borderRadius="xl"
          bg="gray.50"
          px={3}
          py={2.5}
        >
          <Text fontSize="sm" color="gray.600">
            Tip: filters update instantly on desktop. On mobile, tap apply when you’re ready.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default FilterSidebar;
