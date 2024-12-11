import React, {useEffect} from 'react';
import Header from '../header/header';
import Slider from '../slider/slider';
import CourseSection from '../course-section/courseSection';
import InstructorSection from '../instructor-section/instructorSection';
import axios from 'axios';

const Home = () => {

  const getProfile = async () => {
    try {
        const response = await fetch('http://localhost:3003/api/student/profile', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};

  useEffect(() => {
    getProfile();
}, []);

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
