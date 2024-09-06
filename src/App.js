import React from 'react';
import './App.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Home from './components/home/home'; 
import Courses from './components/courses/courses';
import Insititutes from './components/institutes/insititutes';
import CourseDetails from './components/course-details/courseDetails';
import Checkout from './components/checkout/checkout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
        <div className='gradient__bg'>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses/:subcategory" element={<Courses />} />
            <Route path="/institutes" element={<Insititutes />} />
            <Route path='/course-details' element={<CourseDetails/>}/>
            <Route path='/checkout' element={<Checkout/>}/>
          </Routes>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
