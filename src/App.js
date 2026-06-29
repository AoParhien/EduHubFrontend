import React, { Suspense, lazy, useEffect } from 'react';
import { ChakraProvider, Box, Spinner } from '@chakra-ui/react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import './App.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Home from './components/home/home'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import theme from './theme';
import { cspConfig, securityHeaders } from './security';
import useUserStore from './store/useUserStore';

const Courses = lazy(() => import('./components/courses/courses'));
const Institutes = lazy(() => import('./components/institutes/insititutes'));
const CourseDetails = lazy(() => import('./components/course-details/courseDetails'));
const Checkout = lazy(() => import('./components/checkout/checkout'));
const SignUpForm = lazy(() => import('./components/signup-form/signupForm'));
const LoginForm = lazy(() => import('./components/login/login'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const StudentCourses = lazy(() => import('./components/student-courses/studentCourses'));
const InstituteDetails = lazy(() => import('./components/institute-details/instituteDetails'));
const WordMasterGame = lazy(() => import('./components/game/game'));

const RouteFallback = () => (
  <Box minH="50vh" display="flex" alignItems="center" justifyContent="center">
    <Spinner size="xl" color="blue.500" thickness="4px" />
  </Box>
);

function App() {
  const bootstrapSession = useUserStore((state) => state.bootstrapSession);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  return (
    <HelmetProvider>
      <Helmet>
        <meta httpEquiv="Content-Security-Policy" content={Object.entries(cspConfig.directives)
          .map(([key, value]) => `${key} ${value.join(' ')}`)
          .join('; ')} />
        {Object.entries(securityHeaders).map(([key, value]) => (
          <meta key={key} httpEquiv={key} content={value} />
        ))}
      </Helmet>
      <ChakraProvider theme={theme}>
        <Box
          className="App"
          minH="100vh"
          style={{ backgroundImage: 'linear-gradient(180deg, #fbfcff 0%, #eef3fb 100%)' }}
        >
          <Router>
            <Box className='gradient__bg'>
              <Navbar />
              <Suspense fallback={<RouteFallback />}>
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
                  <Route path='/game' element={<WordMasterGame />} />
                  <Route path="*" element={<Box textAlign="center" fontSize="2xl" fontWeight="bold" py={10}>404 - Page Not Found</Box>} />
                </Routes>
              </Suspense>
              <Footer />
            </Box>
          </Router>
        </Box>
      </ChakraProvider>
    </HelmetProvider>
  );
}

// Checking deployment on Vercel
//Updated user creds
export default App;
