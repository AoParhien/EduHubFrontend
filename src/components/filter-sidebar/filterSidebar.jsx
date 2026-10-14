import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { BACKEND_URL } from '../../utils/backendUrl';
import { BOARDS, formatRupees } from '../../utils/format';

export const FEE_LIMIT = 20000;

export const DEFAULT_FILTERS = {
  institute: 'Any',
  subject: 'Any',
  fees: { min: 0, max: FEE_LIMIT },
  board: [],
};

const unique = (values = []) => [...new Set(values.filter(Boolean))];

const FilterGroup = ({ legend, children }) => (
  <Box as="fieldset" border="0" p={0} m={0}>
    <Text as="legend" fontWeight="700" color="ink" fontSize="sm" mb={3}>
      {legend}
    </Text>
    {children}
  </Box>
);

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [institutes, setInstitutes] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async (path) => {
      const response = await fetch(`${BACKEND_URL}${path}`, { signal: controller.signal });
      return response.ok ? response.json() : [];
    };

    Promise.all([load('/api/courses/getSubjects'), load('/api/institutes/getInstituteNames')])
      .then(([subjectData, instituteData]) => {
        setSubjects(unique(subjectData).sort((a, b) => a.localeCompare(b)));
        setInstitutes(unique((instituteData || []).map((item) => item?.name?.trim())));
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const update = (patch) => onFilterChange({ ...filters, ...patch });

  const toggleBoard = (slug) => {
    const boards = filters.board || [];
    update({ board: boards.includes(slug) ? boards.filter((b) => b !== slug) : [...boards, slug] });
  };

  const maxFee = Number(filters.fees?.max ?? FEE_LIMIT);

  return (
    <Stack spacing={7}>
      <FilterGroup legend="Board">
        <Stack spacing={2.5}>
          {BOARDS.map((board) => (
            <Checkbox
              key={board.slug}
              isChecked={(filters.board || []).includes(board.slug)}
              onChange={() => toggleBoard(board.slug)}
            >
              <Text as="span" fontSize="0.9375rem">{board.label}</Text>
            </Checkbox>
          ))}
        </Stack>
      </FilterGroup>

      <FormControl>
        <FormLabel htmlFor="filter-subject" fontWeight="700">Subject</FormLabel>
        <Select
          id="filter-subject"
          value={filters.subject}
          onChange={(event) => update({ subject: event.target.value })}
        >
          <option value="Any">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject.charAt(0).toUpperCase() + subject.slice(1)}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="filter-institute" fontWeight="700">Institute</FormLabel>
        <Select
          id="filter-institute"
          value={filters.institute}
          onChange={(event) => update({ institute: event.target.value })}
        >
          <option value="Any">All institutes</option>
          {institutes.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </Select>
      </FormControl>

      <FilterGroup legend="Monthly fee">
        <Text fontSize="sm" color="muted" mb={3} aria-live="polite">
          {maxFee >= FEE_LIMIT ? 'Any amount' : `Up to ${formatRupees(maxFee)}`}
        </Text>
        <Box px={2}>
          <Slider
            aria-label="Maximum monthly fee"
            value={maxFee}
            min={1000}
            max={FEE_LIMIT}
            step={500}
            onChange={(value) => update({ fees: { ...filters.fees, max: value } })}
          >
            <SliderTrack bg="line">
              <SliderFilledTrack bg="brand.500" />
            </SliderTrack>
            <SliderThumb boxSize={5} borderWidth="2px" borderColor="brand.500" />
          </Slider>
        </Box>
        <Flex justify="space-between" mt={1} color="muted" fontSize="xs">
          <Text>{formatRupees(1000)}</Text>
          <Text>{formatRupees(FEE_LIMIT)}+</Text>
        </Flex>
      </FilterGroup>

      <Button variant="outline" onClick={() => onFilterChange(DEFAULT_FILTERS)}>
        Clear all filters
      </Button>
    </Stack>
  );
};

export default FilterSidebar;
