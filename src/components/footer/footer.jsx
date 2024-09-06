import React from 'react';
import eduhubLogo from '../../logo.svg';
import './footer.css';

const Footer = () => (
    <div className="eduhub__footer section__padding">
        <div className="eduhub__footer-links">
            <div className="eduhub__footer-links_div">
                <h4>Quick Links</h4>
                <p>About Us</p>
                <p>Blog</p>
                <p>FAQs</p>
                <p>Contact Us</p>
            </div>
            <div className="eduhub__footer-links_div">
                <h4>Company</h4>
                <p>Terms & Conditions</p>
                <p>Privacy Policy</p>
                <p>Careers</p>
            </div>
            <div className="eduhub__footer-links_div">
                <h4>Contact Us</h4>
                <p>1234 Elm Street, Suite 567</p>
                <p>+1 (234) 567-890</p>
                <p>support@eduhub.com</p>
            </div>
            <div className="eduhub__footer-links_logo">
                <img src={eduhubLogo} alt="eduhub_logo" />
                <p>1234 Elm Street, Suite 567, <br /> All Rights Reserved</p>
            </div>
        </div>
        <div className="eduhub__footer-copyright">
            <p>&copy; {new Date().getFullYear()} EduHub. All rights reserved.</p>
        </div>
    </div>
);

export default Footer;
