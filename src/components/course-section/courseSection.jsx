import { useState, React, useEffect } from 'react';
import './courseSection.css';
import CourseCard from '../course-card/courseCard';
import TabBar from '../TabBar/TabBar'

const CourseSection = () => {
    const tabs = ['O\'Levels', 'A\'Levels', 'Edexcel', 'Matric', 'Inter', 'ECAT', 'MCAT', 'BCOM'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
        console.log(selectedTab)
    };

    const [courses, setCourses] = useState([]); // State to store courses

    // Function to fetch courses
    const getCourses = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/courses/getCourseListing', {
                method: 'GET',
                credentials: 'include', // Include credentials if required
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCourses(data); // Store fetched data in state
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    // Fetch courses when the component mounts
    useEffect(() => {
        getCourses();
    }, []);
    return (
        <>
            <div className='eduhub__course-section section__padding'>
                <div className='eduhub__course-section-content'>
                    <h1>Explore classes, timetables, and fee structures from the comfort of your home.</h1>
                </div>
                <div className='eduhub__institutes-tabbar'>
                    <TabBar width='40%' tabs={tabs} onSelect={handleTabSelect} />
                </div>
                <div className='eduhub__course-cards'>
                    {courses.map((course, index) => (
                        <CourseCard
                            key={index}
                            title={course.title}
                            fees={course.fees}
                            institute={course.instituteName}
                            board={course.board}
                            imageUrl={course.imageUrl} // Passing image as prop
                        />
                    )
                    )}
                </div>
            </div>
        </>
    );
};

export default CourseSection;
