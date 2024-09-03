import React, { useState } from 'react';
import { Box, Text, Collapse, Button, Input, VStack } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const institutes = ['Any', 'Harvard', 'MIT'];
const subjects = ['Mathematics', 'Physics', 'Chemistry'];
const locations = ['Saddar, Karachi', 'Gulshan, Karachi', 'DHA, Karachi'];
const fontWeight = '500';
const fontSize = '1.35vw'
const collapseWidth = '100%'
const fontSizeSelection = '1.1vw'
const fontColor = "black"
const boxWidth = '60%'

const FilterSidebar = ({ onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState({
        institute: '',
        location: '',
        fees: '',
        // Add other filters as needed
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFilters = { ...localFilters, [name]: value };
        setLocalFilters(updatedFilters);
        onFilterChange(updatedFilters); // Notify parent component of filter changes
    };
    const [isInstituteOpen, setInstituteOpen] = useState(false);
    const [isSubjectOpen, setSubjectOpen] = useState(false);
    const [isLocationOpen, setLocationOpen] = useState(false);

    const [selectedInstitute, setSelectedInstitute] = useState('Any');
    const [selectedSubject, setSelectedSubject] = useState('Any');
    const [selectedLocation, setSelectedLocation] = useState('Any');
    const [minFee, setMinFee] = useState(0);
    const [maxFee, setMaxFee] = useState(15000);

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
        <Box padding="0">
            {/* Institute Filter */}
            <Box marginBottom="1rem" borderBottom="1px solid" borderBottomColor="gray.500" width={boxWidth}>
                <Button
                    variant="link"
                    onClick={() => setInstituteOpen(!isInstituteOpen)}
                    rightIcon={null}  // Remove the rightIcon prop here
                    width={collapseWidth}     // Ensure the button takes full width
                    padding="0"      // Remove any default padding
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text color={fontColor} fontWeight={fontWeight} fontSize={fontSize}>Institute</Text>
                    <ChevronDownIcon
                        marginLeft="auto"
                        transform={isInstituteOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                    />
                </Button>
                <Collapse in={isInstituteOpen} animateOpacity>
                    <VStack align="start" marginTop="0.5rem">
                        {institutes.map((institute) => (
                            <Button
                                key={institute}
                                variant="ghost"
                                onClick={() => handleCollapseSelect('institute', institute)}
                                fontWeight={institute === selectedInstitute ? 'bold' : 'normal'}
                            >
                                {institute}
                            </Button>
                        ))}
                    </VStack>
                </Collapse>

                {!isInstituteOpen && (
                    <Text mt='8px' fontSize={fontSizeSelection} color={fontColor} marginTop="0.5rem">{selectedInstitute}</Text>
                )}
            </Box>

            {/* Subject Filter */}
            <Box marginBottom="1rem" borderBottom="1px solid" borderBottomColor="gray.500" width={boxWidth}>
                <Button
                    variant="link"
                    onClick={() => setSubjectOpen(!isSubjectOpen)}
                    rightIcon={null} // Remove the rightIcon prop here
                    width={collapseWidth} // Ensure the button takes full width
                    padding="0" // Remove any default padding
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text
                        color={fontColor} // Ensure the font color is applied correctly
                        fontWeight={fontWeight}
                        fontSize={fontSize}
                    >
                        Subject
                    </Text>
                    <ChevronDownIcon
                        marginLeft="auto"
                        transform={isSubjectOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                    />
                </Button>

                <Collapse in={isSubjectOpen} animateOpacity>
                    <VStack align="start" marginTop="0.5rem">
                        {subjects.map((subject) => (
                            <Button
                                key={subject}
                                variant="ghost"
                                onClick={() => handleCollapseSelect('subject', subject)}
                                fontWeight={subject === selectedSubject ? 'bold' : 'normal'}
                            >
                                {subject}
                            </Button>
                        ))}
                    </VStack>
                </Collapse>
                {!isSubjectOpen && (
                    <Text mt='8px' fontSize={fontSizeSelection} color={fontColor}>{selectedSubject}</Text>
                )}
            </Box>

            {/* Location Filter */}
            <Box marginBottom="1rem" borderBottom="1px solid" borderBottomColor="gray.500" width={boxWidth}>
                <Button
                    variant="link"
                    onClick={() => setLocationOpen(!isLocationOpen)}
                    rightIcon={null} // Remove the rightIcon prop here
                    width={collapseWidth}     // Ensure the button takes full width
                    padding="0"     // Remove any default padding
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text color={fontColor} fontWeight={fontWeight} fontSize={fontSize}>Location</Text>
                    <ChevronDownIcon
                        marginLeft="auto"
                        transform={isLocationOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                    />
                </Button>
                <Collapse in={isLocationOpen} animateOpacity>
                    <VStack align="start" marginTop="0.5rem">
                        {locations.map((location) => (
                            <Button
                                key={location}
                                variant="ghost"
                                onClick={() => handleCollapseSelect('location', location)}
                                fontWeight={location === selectedLocation ? 'bold' : 'normal'}
                            >
                                {location}
                            </Button>
                        ))}
                    </VStack>
                </Collapse>
                {!isLocationOpen && (
                    <Text mt='8px' fontSize={fontSizeSelection} color={fontColor}>{selectedLocation}</Text>
                )}
            </Box>

            {/* Fees Filter */}
            <Box marginBottom="1rem" borderBottom="1px solid" borderBottomColor="gray.500" width={boxWidth}>
                <Text fontWeight="bold" fontSize="lg">Fees</Text>
                <Box display="flex" gap="1rem" marginTop="0.5rem">
                    <Input
                        placeholder="Min"
                        type="number"
                        value={minFee}
                        onChange={(e) => setMinFee(e.target.value)}
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={maxFee}
                        onChange={(e) => setMaxFee(e.target.value)}
                        mb='1rem'
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default FilterSidebar;
