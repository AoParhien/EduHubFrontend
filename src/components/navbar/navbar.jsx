import { React, useState } from 'react';
// import logo from '../../logo-eduhub.svg';
import './navbar.css';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';



const Navbar = () => {

    const [showCategories, setShowCategories] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);

    const handleMouseEnter = () => {
        setShowCategories(true);
    };

    const handleMouseLeave = () => {
        setShowCategories(false);
    };

    return (
        <div className="eduhub__navbar">
            <div className='eduhub__navbar-container'>
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
                        <h1>LOGO</h1>
                    </div>
                    <div className="eduhub__search-container">
                        <div className='eduhub__search-icon-wrapper'>
                            <svg className="eduhub__search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 2a8 8 0 015.293 13.707l5.62 5.62-1.414 1.414-5.62-5.62A8 8 0 1110 2zm0 2a6 6 0 100 12A6 6 0 0010 4z" /></svg>
                        </div>
                        <input type="search" placeholder="Search for anything" />
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
                                <p>Olevels</p>
                                <p>Alevels</p>
                                <p>Matric</p>
                                <p>Intermediate</p>
                            </div>
                        )}
                    </div>
                    <p>Become an Institute</p>
                    <div className='eduhub__navbar-login'>
                        <button type='button'>Log In</button>
                    </div>
                    <div className='eduhub__navbar-signup'>
                        <button type='button'>Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
