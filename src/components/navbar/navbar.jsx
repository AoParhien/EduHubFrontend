import React, { useState } from 'react';
import './navbar.css';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { AiOutlineSearch } from 'react-icons/ai'; // Import the search icon
import { Link } from 'react-router-dom';
import Dblue from '../../assets/Dblue.png';
import useUserStore from '../../store/useUserStore';

const Navbar = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // Track search query
    const user = useUserStore(state => state.user);
    console.log("User ",user)
    const handleMouseEnter = () => {
        setShowCategories(true);
    };

    const handleMouseLeave = () => {
        setShowCategories(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            // Handle search logic here, for example, redirect or filter data
            console.log('Searching for:', searchQuery);
        }
    };

    return (
        <div className="eduhub__navbar">
            <div className="eduhub__navbar-container">
                <div className="eduhub__navbar-menu">
                    {toggleMenu
                        ? <RiCloseLine color="#000" size={27} onClick={() => setToggleMenu(false)} />
                        : <RiMenu3Line color="#000" size={27} onClick={() => setToggleMenu(true)} />}
                    {toggleMenu && (
                        <div className="eduhub__navbar-menu_container scale-up-center">
                            <div className="eduhub__navbar-menu_container-links-sign">
                                <p>Sign in</p>
                                <p>Sign up</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="eduhub__navbar-left">
                    <div className="eduhub__navbar-links_logo">
                        <Link to="/">
                            <img src={Dblue} alt="EduHub Logo" />
                        </Link>
                    </div>
                    <div className="eduhub__search-container">
                        <form onSubmit={handleSearchSubmit} className="eduhub__search-form">
                            <div className="eduhub__search-icon-wrapper">
                                {/* Replace the SVG with the React icon */}
                                <AiOutlineSearch className="eduhub__search-icon" />
                            </div>
                            <input 
                                type="search" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search for anything"
                            />
                        </form>
                    </div>
                </div>
                <div className="eduhub__navbar-right">
                    <div
                        className="eduhub__categories_button_container"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="eduhub__categories_button">Courses</button>
                        {showCategories && (
                            <div className="eduhub__categories_dropdown">
                                <Link to="/courses/Olevels">
                                    <p>Olevels</p>
                                </Link>
                                <Link to="/courses/Alevels">
                                    <p>Alevels</p>
                                </Link>
                                <Link to="/courses/Matric">
                                    <p>Matric</p>
                                </Link>
                                <Link to="/courses/Intermediate">
                                    <p>Intermediate</p>
                                </Link>
                            </div>
                        )}
                    </div>
                    {user ? (
                        <>
                            <div className='eduhub__navbar-my-courses'>
                                <Link to='/student'>
                                    <button type='button'>Enrollments</button>
                                </Link>
                            </div>  
                            <p className='eduhub__welcome-message'>Welcome, {user.student.firstName}</p>
                        </>                     
                    ) : (
                        <>
                            <p>Become an Institute</p>
                            <div className='eduhub__navbar-login'>
                                <Link to='/login'>
                                    <button type='button'>Log In</button>
                                </Link>
                            </div>
                            <div className='eduhub__navbar-signup'>
                                <Link to='/signup'>
                                    <button type='button'>Sign up</button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
