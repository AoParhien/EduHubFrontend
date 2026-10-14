import React from 'react';
import { Link } from 'react-router-dom';
import Dblue from '../../assets/Dblue.png';
import './footer.css';

const INSTITUTE_SIGNUP_URL =
    process.env.REACT_APP_INSTITUTE_SIGNUP_URL ||
    process.env.VITE_INSTITUTE_SIGNUP_URL ||
    'mailto:aoparhien@gmail.com?subject=List%20my%20institute%20on%20AoParhein';

const Footer = () => (
    <footer className="footer">
        <div className="page footer__inner">
            <div className="footer__brand">
                <Link to="/" aria-label="AoParhein home">
                    <img src={Dblue} alt="AoParhein" />
                </Link>
                <p>Find tuition classes across Pakistan, compare timetables and fees, and book your seat online.</p>
            </div>

            <nav className="footer__columns" aria-label="Footer">
                <div>
                    <h2>Students</h2>
                    <ul>
                        <li><Link to="/courses">Browse courses</Link></li>
                        <li><Link to="/institutes">Institutes</Link></li>
                        <li><Link to="/student">My courses</Link></li>
                        <li><a href="/#how-it-works">How booking works</a></li>
                    </ul>
                </div>
                <div>
                    <h2>Institutes</h2>
                    <ul>
                        <li><a href={INSTITUTE_SIGNUP_URL}>List your institute</a></li>
                    </ul>
                </div>
                <div>
                    <h2>Contact</h2>
                    <ul>
                        <li><a href="tel:+923312316152">+92 331 2316152</a></li>
                        <li><a href="mailto:aoparhien@gmail.com">aoparhien@gmail.com</a></li>
                    </ul>
                </div>
            </nav>
        </div>
        <div className="page">
            <p className="footer__legal">&copy; {new Date().getFullYear()} AoParhein. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;
