import React, { useState, useEffect } from 'react';
import './institutes.css';
import TabBar from '../TabBar/TabBar';
import InstituteCard from '../institute-card/instituteCard';

const Institutes = () => {
    const tabs = ['O\'Levels', 'A\'Levels', 'Edexcel', 'Matric', 'Inter', 'ECAT', 'MCAT', 'BCOM'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstitutes = async () => {
            setLoading(true);
            setError(null); // Reset error state on new fetch

            try {
                const response = await fetch(`http://localhost:3001/api/institutes/getInstitutes?category=${selectedTab}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch institutes');
                }

                const data = await response.json();
                setInstitutes(data);
            } catch (err) {
                setError('Failed to load institutes. Please try again later.');
                console.error('Error fetching institutes:', err);
                setInstitutes([]); // Clear institutes on error
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutes();
    }, [selectedTab]); // Re-fetch when selectedTab changes

    const handleTabSelect = (tab) => {
        if (tab !== selectedTab) {
            setSelectedTab(tab);
        }
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

            {loading ? (
                <div className="eduhub__institutes-loading">
                    <h1>Loading institutes...</h1>
                </div>
            ) : error ? (
                <div className="eduhub__institutes-error">
                    <h1>Error</h1>
                    <p>{error}</p>
                </div>
            ) : (
                <div className='eduhub__institutes-cards'>
                    {institutes.length > 0 ? (
                        institutes.map((institute) => (
                            <InstituteCard 
                                key={institute._id}
                                _id={institute._id}  
                                name={institute.name}
                                registrationFees={institute.registrationFees}
                                pictureUrl={institute.pictureUrl}
                                logoUrl={institute.logoUrl}
                                location={institute.location}
                            />
                        ))
                    ) : (
                        <p>No institutes available for this category.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Institutes;
