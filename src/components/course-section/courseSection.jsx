import { useState, React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './courseSection.css';
import CourseCard from '../course-card/courseCard';
import TabBar from '../TabBar/TabBar';
import { BACKEND_URL } from '../../utils/backendUrl';

const CourseSection = () => {
    const navigate = useNavigate();
    const tabs = ['O\'Levels', 'A\'Levels', 'Edexcel', 'Matric', 'Inter', 'ECAT', 'MCAT', 'BCOM'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const coursesPerPage = 8;

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
    };

    // Function to normalize board names for comparison
    const normalizeBoardName = (boardName) => {
        return boardName
            .replace(/'/g, '')
            .replace(/\s/g, '')
            .toLowerCase();
    };

    // Function to fetch courses
    const getCourses = async () => {
        try {
            const apiUrl = BACKEND_URL;
            const response = await fetch(`${apiUrl}/api/courses/getCourseListing`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCourses(data.courses || []); // Access the courses array from the response
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]); // Set empty array in case of error
        }
    };

    // Effect to filter courses when selectedTab or courses change
    useEffect(() => {
        const normalizedSelectedTab = normalizeBoardName(selectedTab);
        const filtered = courses.filter(course => 
            normalizeBoardName(course.board) === normalizedSelectedTab
        );
        setFilteredCourses(filtered);
    }, [selectedTab, courses]);

    // Fetch courses when the component mounts
    useEffect(() => {
        getCourses();
    }, []);

    const handleViewMore = () => {
        navigate(`/courses/${normalizeBoardName(selectedTab)}`);
    };

    return (
        <div className='eduhub__course-section section__padding'>
            <div className='eduhub__course-section-content'>
                <h1>Explore classes, timetables, and fee structures from the comfort of your home.</h1>
            </div>
            
            <div className='eduhub__institutes-tabbar'>
                <TabBar width='40%' tabs={tabs} onSelect={handleTabSelect} />
            </div>

            <div className='eduhub__course-cards'>
                {filteredCourses.length > 0 ? (
                    <>
                        {filteredCourses.slice(0, coursesPerPage).map((course, index) => (
                            <CourseCard
                                key={index}
                                title={course.title}
                                fees={course.fees}
                                institute={course.instituteName}
                                board={course.board}
                                imageUrl={course.imageUrl}
                                id={course.courseId}
                            />
                        ))}
                    </>
                ) : (
                    <div className="no-courses-message">
                        <p>No courses available for {selectedTab} at the moment.</p>
                        <p>Check back later for updates or explore other categories.</p>
                    </div>
                )}
            </div>

            {filteredCourses.length > coursesPerPage && (
                <div className="view-more-container">
                    <button 
                        className="view-more-button"
                        onClick={handleViewMore}
                    >
                        View More {selectedTab} Courses
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseSection;