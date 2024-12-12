import React from 'react';
import Header from '../header/header';
import Slider from '../slider/slider';
import CourseSection from '../course-section/courseSection';
import InstructorSection from '../instructor-section/instructorSection';
import Features from '../Features/Features';
import CrashCourseSection from '../crashcourse-section/crashcourse';

const Home = () => {


  return (
    <div>
     
      <Header />
      <Slider />
      <CourseSection />
      <InstructorSection />
      <Features/>
      <CrashCourseSection/>
      
   
    </div>
  );
};

export default Home;
