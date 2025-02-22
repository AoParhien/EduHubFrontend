import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react'; // Import ChakraProvider
import './App.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Home from './components/home/home'; 
import Courses from './components/courses/courses';
import Institutes from './components/institutes/insititutes';
import CourseDetails from './components/course-details/courseDetails';
import Checkout from './components/checkout/checkout';
import SignUpForm from './components/signup-form/signupForm';
import LoginForm from './components/login/login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProfile from './components/UserProfile';
import StudentCourses from './components/student-courses/studentCourses';
import InstituteDetails from './components/institute-details/instituteDetails';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}> {/* Wrap the app with ChakraProvider */}
      <Box className="App" bgGradient="linear(to-b, #f9f9f9, #e3e3e3)" minH="100vh">
        <Router>
          <Box className='gradient__bg'>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses/:subcategory?" element={<Courses />} />
              <Route path="/institutes" element={<Institutes />} />
              <Route path='/course-details/:courseId?' element={<CourseDetails />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/signup' element={<SignUpForm />} />
              <Route path='/login' element={<LoginForm />} />
              <Route path='/profile' element={<UserProfile />} />
              <Route path='/student' element={<StudentCourses />} />
              <Route path="/institute/:id" element={<InstituteDetails />} />
              <Route path="*" element={<Box textAlign="center" fontSize="2xl" fontWeight="bold" py={10}>404 - Page Not Found</Box>} />
            </Routes>
            <Footer />
          </Box>
        </Router>
      </Box>
    </ChakraProvider>
  );
}

// Checking deployment on Vercel
export default App;