import React from 'react';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Slider from 'react-slick';

// Assume you have a CardComponent already defined
import CourseCard from '../course-card/courseCard';
// You would need to install these packages:
// npm install react-slick slick-carousel

const CourseCarousel = ({ courses }) => {
  const sliderRef = React.useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  return (
    <Box position="relative" px={8}>
      <Slider ref={sliderRef} {...settings}>
        {courses.map((course, index) => (
          <Box key={index} px={2} py={2}>
            <CourseCard />
          </Box>
        ))}
      </Slider>
      <Flex justify="space-between" position="absolute" top="50%" left={0} right={0} transform="translateY(-50%)">
        <IconButton
          aria-label="Previous course"
          icon={<ChevronLeftIcon />}
          onClick={goToPrev}
          colorScheme="purple"
          rounded="full"
          position="absolute"
          left={2}
        />
        <IconButton
          aria-label="Next course"
          icon={<ChevronRightIcon />}
          onClick={goToNext}
          colorScheme="purple"
          rounded="full"
          position="absolute"
          right={2}
        />
      </Flex>
    </Box>
  );
};

export default CourseCarousel;