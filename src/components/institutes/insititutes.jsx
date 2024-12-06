import React, { useState } from 'react';
import './institutes.css';
import TabBar from '../TabBar/TabBar';
import InstituteCard from '../institute-card/instituteCard';

const Institutes = () => {
    const tabs = ['O\'Levels', 'A\'Levels', 'Edexcel', 'Matric', 'Inter', 'ECAT', 'MCAT', 'BCOM'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
        console.log(selectedTab);
    };

    return (
        <div className='eduhub__institutes section__padding'>
            <div className='eduhub__institutes-header'>
                <h1>Institutes On Board</h1>
                <p>Explore and find the best institutes for your preferred education track.</p>
            </div>
            <div className='eduhub__institutes-tabbar'>
                <TabBar tabs={tabs} onSelect={handleTabSelect} selectedTab={selectedTab} />
            </div>
            <div className='eduhub__institutes-cards'>
                {[...Array(10)].map((_, index) => (
                    <InstituteCard key={index} />
                ))}
            </div>
        </div>
    );
};

export default Institutes;
