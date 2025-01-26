import React, { useState } from 'react';
import './navbar.css';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link, NavLink } from 'react-router-dom';
import Dblue from '../../assets/Dblue.png';
import useUserStore from '../../store/useUserStore';

const Navbar = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const user = useUserStore(state => state.user);

    const handleMouseEnter = () => setShowCategories(true);
    const handleMouseLeave = () => setShowCategories(false);

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            // Implement your search logic here
            console.log('Searching for:', searchQuery);
        }
    };

    return (
        <nav className="eduhub__navbar">
            <div className="eduhub__navbar-container">
                <div className="eduhub__navbar-left">
                    <Link to="/" className="eduhub__navbar-logo">
                        <img src={Dblue} alt="EduHub Logo" />
                    </Link>
                    <form onSubmit={handleSearchSubmit} className="eduhub__search-form">
                        <AiOutlineSearch className="eduhub__search-icon" aria-hidden="true" />
                        <input 
                            type="search" 
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for anything..."
                            aria-label="Search"
                        />
                    </form>
                </div>
                <div className="eduhub__navbar-right">
                    <div className="eduhub__categories" aria-haspopup="true">
                        <button 
                            className="eduhub__categories-button" 
                            aria-expanded={showCategories}
                            onClick={() => setShowCategories(prev => !prev)}
                        >
                            {showCategories ? 'Close' : 'Courses'} 
                            <span className="dropdown-arrow">
                                {showCategories ? '\u2716' : '\u25BC'}
                            </span>
                        </button>
                        {showCategories && (
                            <div className="eduhub__categories-dropdown" role="menu">
                                <NavLink to="/courses/Olevels" activeClassName="active" role="menuitem">O-Levels</NavLink>
                                <NavLink to="/courses/Alevels" activeClassName="active" role="menuitem">A-Levels</NavLink>
                                <NavLink to="/courses/Matric" activeClassName="active" role="menuitem">Matric</NavLink>
                                <NavLink to="/courses/Intermediate" activeClassName="active" role="menuitem">Intermediate</NavLink>
                            </div>
                        )}
                    </div>
                    {user ? (
                        <div className="eduhub__user-info">
                            <img src={user.avatar || '/default-avatar.png'} alt={`${user.student.firstName}'s avatar`} className="eduhub__user-avatar" />
                            <span className="eduhub__welcome-message">Welcome, {user.student.firstName}</span>
                        </div>
                    ) : (
                        <div className="eduhub__auth-buttons">
                            <Link to="/login" className="eduhub__login-link">Log In</Link>
                            <Link to="/signup" className="eduhub__signup-link">Sign Up</Link>
                        </div>
                    )}
                </div>
                <div className="eduhub__navbar-menu">
                    {toggleMenu
                        ? <RiCloseLine color="#00308F" size={27} onClick={() => setToggleMenu(false)} aria-label="Close menu" />
                        : <RiMenu3Line color="#00308F" size={27} onClick={() => setToggleMenu(true)} aria-label="Open menu" />}
                    {toggleMenu && (
                        <div className="eduhub__navbar-menu_dropdown">
                            <NavLink to="/" activeClassName="active" onClick={() => setToggleMenu(false)}>Home</NavLink>
                            <NavLink to="/courses" activeClassName="active" onClick={() => setToggleMenu(false)}>Courses</NavLink>
                            <NavLink to="/about" activeClassName="active" onClick={() => setToggleMenu(false)}>About</NavLink>
                            <NavLink to="/contact" activeClassName="active" onClick={() => setToggleMenu(false)}>Contact</NavLink>
                            {user ? (
                                <div className="eduhub__navbar-user">
                                    <img src={user.avatar || '/default-avatar.png'} alt={`${user.student.firstName}'s avatar`} className="eduhub__user-avatar" />
                                    <span>Welcome, {user.student.firstName}</span>
                                </div>
                            ) : (
                                <div className="eduhub__navbar-auth">
                                    <Link to="/login" onClick={() => setToggleMenu(false)}>Log In</Link>
                                    <Link to="/signup" onClick={() => setToggleMenu(false)}>Sign Up</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
