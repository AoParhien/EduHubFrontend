import React, { useState, useEffect, useRef, useCallback } from 'react';
import './navbar.css';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { BiMenuAltLeft } from "react-icons/bi";
import { AiOutlineSearch } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Dblue from '../../assets/Dblue.png';
import useUserStore from '../../store/useUserStore';
import axios from 'axios';
import debounce from 'lodash.debounce';

const Navbar = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileSearchQuery, setMobileSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [mobileSearchResults, setMobileSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mobileLoading, setMobileLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileDropdown, setShowMobileDropdown] = useState(false);
    const user = useUserStore(state => state.user);
    const authUser = useUserStore(state => state.authUser);
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const mobileSearchRef = useRef(null);
    const studentFirstName = user?.student?.firstName;
    const welcomeLabel = studentFirstName || authUser?.email || 'Your account';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                searchRef.current && !searchRef.current.contains(event.target)
            ) {
                setToggleMenu(false);
                setShowDropdown(false);
            }
            
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
                setShowMobileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (toggleMenu) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
        
        return () => {
            document.body.classList.remove('menu-open');
        };
    }, [toggleMenu]);

    const fetchSearchResults = async (query, isMobile = false) => {
        if (!query) {
            isMobile ? setMobileSearchResults([]) : setSearchResults([]);
            return;
        }
        
        isMobile ? setMobileLoading(true) : setLoading(true);
        
        try {
            const instititeServiceUrl = process.env.REACT_APP_INSTITUTE_SERVICE_URL;
            const response = await axios.get(`${instititeServiceUrl}/api/courses/search?title=${query}`);
            isMobile ? 
                setMobileSearchResults(response.data.courses || []) : 
                setSearchResults(response.data.courses || []);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            isMobile ? setMobileLoading(false) : setLoading(false);
        }
    };

    // Debounced API calls
    const debouncedSearch = useCallback(
        debounce((query) => fetchSearchResults(query, false), 500), []
    );
    
    const debouncedMobileSearch = useCallback(
        debounce((query) => fetchSearchResults(query, true), 500), []
    );

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowDropdown(!!query);
        debouncedSearch(query);
    };
    
    const handleMobileSearchChange = (e) => {
        const query = e.target.value;
        setMobileSearchQuery(query);
        setShowMobileDropdown(!!query);
        debouncedMobileSearch(query);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Optional: add search submission logic here
    };

    const closeMenu = () => {
        setToggleMenu(false);
        setShowMobileDropdown(false);
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
                            <div className="mobile-search" ref={mobileSearchRef}>
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="search-wrapper">
                                        <AiOutlineSearch className="search-icon" />
                                        <input 
                                            type="search" 
                                            value={mobileSearchQuery}
                                            onChange={handleMobileSearchChange}
                                            placeholder="Search for courses..."
                                        />
                                    </div>
                                </form>
                                
                                {/* Mobile Search Dropdown */}
                                {showMobileDropdown && (
                                    <>
                                        <div className="mobile-search-overlay visible" onClick={() => setShowMobileDropdown(false)}></div>
                                        <div className={`search-dropdown ${showMobileDropdown ? 'visible' : ''}`}>
                                            {mobileLoading ? (
                                                <div className="loading">Searching</div>
                                            ) : mobileSearchResults.length > 0 ? (
                                                mobileSearchResults.map((course, index) => (
                                                    <Link 
                                                        key={index} 
                                                        to={`/course-details/${course._id}`} 
                                                        className="search-result-item"
                                                        onClick={() => {
                                                            setShowMobileDropdown(false);
                                                            setMobileSearchQuery('');
                                                            closeMenu();
                                                        }}
                                                    >
                                                        {course.title}
                                                    </Link>
                                                ))
                                            ) : mobileSearchQuery.length > 0 ? (
                                                <div className="no-results">No courses found matching "{mobileSearchQuery}"</div>
                                            ) : (
                                                <div className="no-results">Type to search for courses</div>
                                            )}
                                        </div>
                                    </>
                                )}
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

                            {studentFirstName ? (
                                <div className="mobile-nav-section">
                                    <Link to="/student" onClick={closeMenu} className="mobile-enrollment">
                                        My Enrollments
                                    </Link>
                                    <p className="mobile-welcome">Welcome, {welcomeLabel}</p>
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

                <div className="eduhub__navbar-left">
                    <div className="eduhub__navbar-links_logo">
                        <Link to="/">
                            <img src={Dblue} alt="EduHub Logo" />
                        </Link>
                    </div>
                    <div className="eduhub__search-container" ref={searchRef}>
                        <form className="eduhub__search-form" onSubmit={handleSearchSubmit}>
                            <div className="eduhub__search-icon-wrapper">
                                <AiOutlineSearch className="eduhub__search-icon" />
                            </div>
                            <input 
                                type="search" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search for courses..."
                            />
                        </form>

                        {/* Desktop Search Dropdown */}
                        {showDropdown && (
                            <div className={`search-dropdown ${showDropdown ? 'visible' : ''}`}>
                                {loading ? (
                                    <div className="loading">Searching</div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((course, index) => (
                                        <Link 
                                            key={index} 
                                            to={`/course-details/${course._id}`} 
                                            className="search-result-item"
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            {course.title}
                                        </Link>
                                    ))
                                ) : searchQuery.length > 0 ? (
                                    <div className="no-results">No courses found matching "{searchQuery}"</div>
                                ) : (
                                    <div className="no-results">Type to search for courses</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="eduhub__navbar-right">
                    <div 
                        className="eduhub__categories_button_container"
                        onMouseEnter={() => setShowCategories(true)}
                        onMouseLeave={() => setShowCategories(false)}
                    >
                        <Link to="/courses">
                            <button className="eduhub__categories_button">Courses</button>
                        </Link>
                        {showCategories && (
                            <div className="eduhub__categories_dropdown">
                                <Link to="/courses/Olevels"><p>Olevels</p></Link>
                                <Link to="/courses/Alevels"><p>Alevels</p></Link>
                                <Link to="/courses/Matric"><p>Matric</p></Link>
                                <Link to="/courses/Intermediate"><p>Intermediate</p></Link>
                            </div>
                        )}
                    </div>
                    {studentFirstName ? (
                        <>
                            <div className='eduhub__navbar-my-courses'>
                                <Link to='/student'>
                                    <button type='button'>Enrollments</button>
                                </Link>
                            </div>  
                            <p className='eduhub__welcome-message'>Welcome, {welcomeLabel}</p>
                        </>                     
                    ) : (
                        <>
                            <Link to="/institutes">
                                <p>Become an Institute</p>
                            </Link>
                            <div className='eduhub__navbar-login'>
                                <Link to='/login'><button type='button'>Log In</button></Link>
                            </div>
                            <div className='eduhub__navbar-signup'>
                                <Link to='/signup'><button type='button'>Sign up</button></Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
