import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Slider from 'react-slick'; // Importing react-slick for the carousel functionality
import CourseCard from '../course-card/courseCard';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 

const CourseCarousel = ({ courses }) => {
  const settings = {
    dots: true, // Enables dots for navigation
    infinite: true, // Infinite looping
    speed: 500, // Animation speed
    slidesToShow: 3, // Number of slides visible at a time
    slidesToScroll: 1, // Number of slides to scroll on arrow click
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
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

  return (
    <Box maxW="1400px" mx="auto" py={8} px={4}>
      <Slider {...settings}>
        {courses.map((course) => (
          <Box key={course.courseId}>
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
    </Box>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <IconButton 
      aria-label="Previous course" 
      icon={<ChevronLeftIcon />} 
      onClick={onClick} 
      bg="blue.800" 
      color="white" 
      rounded="full" 
      _hover={{ bg: 'blue.900' }} 
      position="absolute" 
      left={-10} 
      top="50%" 
      transform="translateY(-50%)" 
      zIndex={2} 
      size="lg" 
    />
  );
};

const NextArrow = ({ onClick }) => {
  return (
    <IconButton 
      aria-label="Next course" 
      icon={<ChevronRightIcon />} 
      onClick={onClick} 
      bg="blue.800" 
      color="white" 
      rounded="full" 
      _hover={{ bg: 'blue.900' }} 
      position="absolute" 
      right={-10} 
      top="50%" 
      transform="translateY(-50%)" 
      zIndex={2} 
      size="lg" 
    />
  );
};

export default CourseCarousel;
