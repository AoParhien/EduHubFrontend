import React from 'react';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Slider from 'react-slick';
import CourseCard from '../course-card/courseCard';

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
        breakpoint: 1200, // Added breakpoint for larger screens
        settings: {
          slidesToShow: 4, 
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handlePrevClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNextClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <Box position="relative" px={100}>
      <Slider ref={sliderRef} {...settings}>
        {courses.map((course) => (
          <Box key={course.courseId} px={1} py={2}> 
            <CourseCard 
              title={course.title}
              institute={course.institute}
              fees={course.fees}
              board={course.board}
              imageUrl={course.imageUrl}
              id={course.courseId}
            />
          </Box>
        ))}
      </Slider>
      <Flex
        justify="space-between"
        position="absolute"
        top="50%"
        left={0}
        right={0}
        transform="translateY(-50%)"
        px={4}
      >
        <IconButton
          aria-label="Previous course"
          icon={<ChevronLeftIcon />}
          onClick={handlePrevClick}
          bg="blue.800"
          color="white"
          rounded="full"
          _hover={{ bg: "blue.900" }}
          position="absolute"
          left={2}
        />
        <IconButton
          aria-label="Next course"
          icon={<ChevronRightIcon />}
          onClick={handleNextClick}
          bg="blue.800"
          color="white"
          rounded="full"
          _hover={{ bg: "blue.900" }}
          position="absolute"
          right={2}
        />
      </Flex>
    </Box>
  );
};

export default CourseCarousel;