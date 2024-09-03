import React, { useState, useRef } from 'react';
import './TabBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const TabBar = ({ width = '100%', tabs, onSelect }) => {
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const scrollContainerRef = useRef(null);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        onSelect(tab);
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -130 : 130, // Scroll amount, adjust as needed
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="tabbar-container">
            <button className="tabbar-button" onClick={() => scroll('left')}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div
                className="tabbar-scroll"
                ref={scrollContainerRef}
                style={{ width }}
            >
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`tabbar-tab ${tab === selectedTab ? 'selected' : ''}`}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <button className="tabbar-button" onClick={() => scroll('right')}>
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};

export default TabBar;
