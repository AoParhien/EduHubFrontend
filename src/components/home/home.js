import React from 'react';
import Header from '../header/header';
import CourseSection from '../course-section/courseSection';
import InstructorSection from '../instructor-section/instructorSection';
import Features from '../Features/Features';
import PageTitle from '../page-title/PageTitle';

const Home = () => (
  <>
    <PageTitle />
    <Header />
    <CourseSection />
    <Features />
    <InstructorSection />
  </>
);

export default Home;
