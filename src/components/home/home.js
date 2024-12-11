import React from 'react';
import Header from '../header/header';
import Slider from '../slider/slider';
import CourseSection from '../course-section/courseSection';
import InstructorSection from '../instructor-section/instructorSection';

const Home = () => {


  return (
    <div>
     
      <Header />
      <Slider />
      <CourseSection />
      <InstructorSection />
   
    </div>
  );
};

export default Home;
