import { useState, React, useEffect } from 'react';
import './courseSection.css';
import CourseCard from '../course-card/courseCard';
import TabBar from '../TabBar/TabBar';

const CourseSection = () => {
    const tabs = ['O\'Levels', 'A\'Levels', 'Edexcel', 'Matric', 'Inter', 'ECAT', 'MCAT', 'BCOM'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
        setCurrentPage(1); // Reset to the first page when the tab changes
    };

    const [courses, setCourses] = useState([]); // State to store all courses
    const [filteredCourses, setFilteredCourses] = useState([]); // State to store filtered courses

    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const coursesPerPage = 4; // Number of courses per page

    // Function to normalize board names for comparison
    const normalizeBoardName = (boardName) => {
        return boardName
            .replace(/'/g, '') // Remove apostrophes
            .replace(/\s/g, '') // Remove spaces
            .toLowerCase(); // Convert to lowercase
    };

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
            console.log(data);
            setCourses(data); // Store all fetched data
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    // Effect to filter courses when selectedTab or courses change
    useEffect(() => {
        const normalizedSelectedTab = normalizeBoardName(selectedTab);

        const filtered = courses.filter(course => 
            normalizeBoardName(course.board) === normalizedSelectedTab
        );
        setFilteredCourses(filtered);
        setCurrentPage(1); // Reset to the first page when the filtered courses change
    }, [selectedTab, courses]);

    // Fetch courses when the component mounts
    useEffect(() => {
        getCourses();
    }, []);

    // Calculate the courses to display on the current page
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

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
                    {currentCourses.map((course, index) => (
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
                </div>
                <div className='pagination'>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CourseSection;
