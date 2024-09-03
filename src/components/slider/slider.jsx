import React, { useEffect, useRef } from 'react';
import './slider.css';
import stanford from '../../assets/stanford.png'
import google from '../../assets/google.png'
import penn from '../../assets/penn.png'
import duke from '../../assets/duke.png'
import illinois from '../../assets/illinois.png'
import ibm from '../../assets/ibm.png'

const Slider = () => {
    const images = [stanford, duke, penn, google, illinois, ibm];

    const marqueeRef = useRef(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        if (marquee) {
            const duration = 20; // Duration in seconds
            const marqueeWidth = marquee.scrollWidth;
            const containerWidth = marquee.offsetWidth;
            const totalWidth = marqueeWidth / 2;
            const animationDuration = (totalWidth / containerWidth) * duration;

            marquee.style.animation = `marquee ${animationDuration}s linear infinite`;

            // Clone nodes when animation ends to create seamless loop
            marquee.addEventListener('animationiteration', () => {
                marquee.style.animation = 'none';
                // Fix: Assign the offsetHeight to a variable to satisfy the linter
                marquee.style.animation = `marquee ${animationDuration}s linear infinite`;
            });
        }
    }, []);

    return (
        <div className="image-button-container">
            <div className="image-button-marquee" ref={marqueeRef}>
                {images.concat(images).map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Button ${index + 1}`}
                        className="image-button"
                        onClick={() => alert(`Button ${index + 1} clicked`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;