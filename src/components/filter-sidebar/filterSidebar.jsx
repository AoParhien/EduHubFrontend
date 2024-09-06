import React, { useEffect, useState } from 'react';
import { Box, Text, Collapse, Button, Input, VStack } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const locations = ['Saddar, Karachi', 'Gulshan, Karachi', 'DHA, Karachi'];
const fontWeight = '500';
const fontSize = '1.35vw'
const collapseWidth = '100%'
const fontSizeSelection = '1.1vw'
const fontColor = "black"
const boxWidth = '60%'

const FilterSidebar = ({ onFilterChange }) => {

    const [institutes, setInstitutes] = useState([{ "name": "Any" }])
    const [subjects, setSubjects] = useState(['Any'])

    const [localFilters, setLocalFilters] = useState({
        institute: 'Any',
        subject: 'Any',
        location: 'Any',
        fees: { min: 0, max: 15000 },
    });

    const handleChange = (name, value) => {
        const updatedFilters = { ...localFilters, [name]: value };
        setLocalFilters(updatedFilters);
        onFilterChange(updatedFilters); // Notify parent component of filter changes
    };
    const [isInstituteOpen, setInstituteOpen] = useState(false);
    const [isSubjectOpen, setSubjectOpen] = useState(false);
    const [isLocationOpen, setLocationOpen] = useState(false);

    const handleCollapseSelect = (type, value) => {
        handleChange(type, value); // Use handleChange to update state and notify parent
        switch (type) {
            case 'institute':
                setInstituteOpen(false);
                break;
            case 'subject':
                setSubjectOpen(false);
                break;
            case 'location':
                setLocationOpen(false);
                break;
            default:
                break;
        }
    };

    const getSubjects = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/courses/getSubjects', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json()
            // Assuming `data` is the new array of subjects you want to append
            setSubjects((prevSubjects) => [...prevSubjects, ...data]);
        }
        catch (error) {
            console.error('Error fetching courses:', error);

        }
    }

    const getInstitutes = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/institutes/getInstituteNames', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json()
            // Assuming `data` is the new array of subjects you want to append
            setInstitutes((prevInstitutes) => [...prevInstitutes, ...data]);
        }
        catch (error) {
            console.error('Error fetching courses:', error);

        }
    }

    useEffect(() => {
        getSubjects()
        getInstitutes()
    }, [])

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
                                onClick={() => handleCollapseSelect('institute', institute.name)}
                                fontWeight={institute.name === localFilters.institute ? 'bold' : 'normal'}
                            >
                                {institute.name}
                            </Button>
                        ))}
                    </VStack>
                </Collapse>

                {!isInstituteOpen && (
                    <Text mt='8px' fontSize={fontSizeSelection} color={fontColor} marginTop="0.5rem">{localFilters.institute}</Text>
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
                                fontWeight={subject === localFilters.subject ? 'bold' : 'normal'}
                            >
                                {subject}
                            </Button>
                        ))}
                    </VStack>
                </Collapse>
                {!isSubjectOpen && (
                    <Text mt='8px' fontSize={fontSizeSelection} color={fontColor}>{localFilters.subject}</Text>
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
                                fontWeight={location === localFilters.location ? 'bold' : 'normal'}
                            >
                                {location}
                            </Button>
                        ))}
                    </VStack>
                </Collapse>
                {!isLocationOpen && (
                    <Text mt='8px' fontSize={fontSizeSelection} color={fontColor}>{localFilters.location}</Text>
                )}
            </Box>

            {/* Fees Filter */}
            <Box marginBottom="1rem" borderBottom="1px solid" borderBottomColor="gray.500" width={boxWidth}>
                <Text fontWeight="bold" fontSize="lg">Fees</Text>
                <Box display="flex" gap="1rem" marginTop="0.5rem">
                    <Input
                        placeholder="Min"
                        type="number"
                        value={localFilters.fees.min}
                        onChange={(e) => handleChange('fees', { ...localFilters.fees, min: e.target.value })}
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={localFilters.fees.max}
                        onChange={(e) => handleChange('fees', { ...localFilters.fees, max: e.target.value })}
                        mb='1rem'
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default FilterSidebar;
