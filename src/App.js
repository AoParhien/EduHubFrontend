import React, { Suspense, lazy, useEffect } from 'react';
import { ChakraProvider, Box, Spinner } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Home from './components/home/home';
import theme from './theme';
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
const NotFound = lazy(() => import('./components/not-found/NotFound'));

const RouteFallback = () => (
  <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
    <Spinner size="lg" color="brand.500" thickness="3px" label="Loading page" />
  </Box>
);

// Start each new page at the top instead of keeping the previous scroll position.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const bootstrapSession = useUserStore((state) => state.bootstrapSession);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  return (
    <HelmetProvider>
      <ChakraProvider theme={theme}>
        <Router>
          <ScrollToTop />
          <Box className="App">
            <Navbar />
            <main className="app-main" id="main">
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses/:subcategory?" element={<Courses />} />
                  <Route path="/institutes" element={<Institutes />} />
                  <Route path="/course-details/:courseId?" element={<CourseDetails />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/signup" element={<SignUpForm />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/student" element={<StudentCourses />} />
                  <Route path="/institute/:id" element={<InstituteDetails />} />
                  <Route path="/game" element={<WordMasterGame />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </Box>
        </Router>
      </ChakraProvider>
    </HelmetProvider>
  );
}

export default App;
