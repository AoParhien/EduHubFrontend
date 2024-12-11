import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './footer.css';

const Footer = () => (
    <div className="eduhub__footer section__padding">
        <div className="eduhub__footer-links">
            <div className="eduhub__footer-links_div">
                <h4>Quick Links</h4>
                <Link to="/about-us"><p>About Us</p></Link>  {/* Add routes here */}
                <Link to="/institutes"><p>Institutes On-Board</p></Link>
                <Link to="/blog"><p>Blog</p></Link>
                <Link to="/faq"><p>FAQs</p></Link>
                <Link to="/contact-us"><p>Contact Us</p></Link>
            </div>
            <div className="eduhub__footer-links_div">
                <h4>Company</h4>
                <Link to="/terms"><p>Terms & Conditions</p></Link>
                <Link to="/privacy-policy"><p>Privacy Policy</p></Link>
                <Link to="/careers"><p>Careers</p></Link>
            </div>
            <div className="eduhub__footer-links_div">
                <h4>Contact Us</h4>
                <p>1234 Elm Street, Suite 567</p>
                <p>+1 (234) 567-890</p>
                <p>support@AoParhein.com</p>
            </div>
            <div className="eduhub__footer-links_logo">
              <img src="Dblue.png" alt="eduhub_logo" />
                <p>Ao Parhein<br /> Platform which makes education accessible</p>
            </div>
        </div>
        <div className="eduhub__footer-copyright">
            <p>&copy; {new Date().getFullYear()} AoParhein. All rights reserved.</p>
        </div>
    </div>
);

export default Footer;
