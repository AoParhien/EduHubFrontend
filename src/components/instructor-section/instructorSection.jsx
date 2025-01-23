import React, { useState, useEffect } from 'react';
import './instructorSection.css';
import InstructorCard from '../instructor-card/instructorCard';
import Slider from 'react-slick'; // Import react-slick slider
import "slick-carousel/slick/slick.css"; // Import slick styles
import "slick-carousel/slick/slick-theme.css";

const InstructorSection = () => {
    const [topTeachers, setTopTeachers] = useState([]);

    // Fetch top teachers from the API
    const getCourses = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/teachers/getTopTeachers', {
                method: 'GET',
                credentials: 'include', // Include credentials if required
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Expand data to ensure a consistent number of cards (6)
            const expandedData = Array.from({ length: 6 }, (_, i) => data[i % data.length]);

            setTopTeachers(expandedData);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        getCourses();
    }, []);

    // Slider settings for responsiveness
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="eduhub__instructor-section section__padding">
            <div className="eduhub__instructor-section-content">
                <h1 className="highlight-title">Meet Our Best Instructors</h1>
                <p className="subtitle">
                    At AoParhein, we bring together top-notch educators to deliver exceptional learning experiences.
                </p>
            </div>
            <div className="eduhub__instructor-section-instructors">
                <Slider {...sliderSettings}>
                    {topTeachers.map((teacher, index) => (
                        <div key={teacher?.id || index} className="slider-item"> {/* Wrap each card in a slider item */}
                            <div className="instructor-card-container">
                                <img
                                    src={teacher?.picture || 'defaultImagePath'}
                                    alt={teacher?.name || 'Instructor Picture'}
                                    className="instructor-image"
                                />
                                <div className="instructor-details">
                                    <h3 className="instructor-name">{teacher?.name || 'Unknown Instructor'}</h3>
                                    <p className="instructor-board">{teacher?.boards?.[0] || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default InstructorSection;