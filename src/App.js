import React from 'react';
import './App.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Home from './components/home/home'; 
import Courses from './components/courses/courses';
import Insititutes from './components/institutes/insititutes';
import CourseDetails from './components/course-details/courseDetails';
import Checkout from './components/checkout/checkout';
import SignUpForm from './components/signup-form/signupForm';
import LoginForm from './components/login/login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProfile from './components/UserProfile';
import Cookies from 'js-cookie'


function App() {
  return (
    <div className="App">
      <Router>
        <div className='gradient__bg'>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses/:subcategory" element={<Courses />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/institutes" element={<Insititutes />} />
            <Route path='/course-details' element={<CourseDetails/>}/>
            <Route path='/course-details/:courseId' element={<CourseDetails/>}/>
            <Route path='/checkout' element={<Checkout/>}/>
            <Route path='/signup' element={<SignUpForm />}/>
            <Route path='/login' element={<LoginForm />} />
            <Route path='/profile' element={<UserProfile />} />
         
          </Routes>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
