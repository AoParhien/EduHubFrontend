import React, { useState, useEffect, useRef } from 'react';
import './navbar.css';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { BiMenuAltLeft } from "react-icons/bi";
import { AiOutlineSearch } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Dblue from '../../assets/Dblue.png';
import useUserStore from '../../store/useUserStore';

const Navbar = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const user = useUserStore(state => state.user);
    const menuRef = useRef(null);

    useEffect(() => {
        // Close menu when clicking outside
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setToggleMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            console.log('Searching for:', searchQuery);
        }
    };

    const closeMenu = () => {
        setToggleMenu(false);
    };

    return (
        <div className="eduhub__navbar">
            <div className="eduhub__navbar-container">
                <div className="eduhub__navbar-menu" ref={menuRef}>
                    {toggleMenu
                        ? <RiCloseLine color="#000" size={27} onClick={() => setToggleMenu(false)} />
                        : <BiMenuAltLeft color="#000" size={27} onClick={() => setToggleMenu(true)} />}
                    {toggleMenu && (
                        <div className="eduhub__navbar-menu_container slide-in">
                            <div className="mobile-search">
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="search-wrapper">
                                        <AiOutlineSearch className="search-icon" />
                                        <input 
                                            type="search" 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search for anything"
                                        />
                                    </div>
                                </form>
                            </div>
                            
                            <div className="mobile-nav-section">
                                <h3>Courses</h3>
                                <div className="mobile-nav-links">
                                    <Link to="/courses/Olevels" onClick={closeMenu}>
                                        O Levels
                                    </Link>
                                    <Link to="/courses/Alevels" onClick={closeMenu}>
                                        A Levels
                                    </Link>
                                    <Link to="/courses/Matric" onClick={closeMenu}>
                                        Matric
                                    </Link>
                                    <Link to="/courses/Intermediate" onClick={closeMenu}>
                                        Intermediate
                                    </Link>
                                </div>
                            </div>

                            {user ? (
                                <div className="mobile-nav-section">
                                    <Link to="/student" onClick={closeMenu} className="mobile-enrollment">
                                        My Enrollments
                                    </Link>
                                    <p className="mobile-welcome">Welcome, {user.student.firstName}</p>
                                </div>
                            ) : (
                                <div className="mobile-nav-section">
                                    <Link to="/institutes" onClick={closeMenu} className="mobile-institute">
                                        Become an Institute
                                    </Link>
                                    <div className="mobile-auth">
                                        <Link to="/login" onClick={closeMenu} className="mobile-login">
                                            Log In
                                        </Link>
                                        <Link to="/signup" onClick={closeMenu} className="mobile-signup">
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Existing desktop navbar content remains unchanged */}
                <div className="eduhub__navbar-left">
                    <div className="eduhub__navbar-links_logo">
                        <Link to="/">
                            <img src={Dblue} alt="EduHub Logo" />
                        </Link>
                    </div>
                    <div className="eduhub__search-container">
                        <form onSubmit={handleSearchSubmit} className="eduhub__search-form">
                            <div className="eduhub__search-icon-wrapper">
                                <AiOutlineSearch className="eduhub__search-icon" />
                            </div>
                            <input 
                                type="search" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for anything"
                            />
                        </form>
                    </div>
                </div>
                <div className="eduhub__navbar-right">
                    <div
                        className="eduhub__categories_button_container"
                        onMouseEnter={() => setShowCategories(true)}
                        onMouseLeave={() => setShowCategories(false)}
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