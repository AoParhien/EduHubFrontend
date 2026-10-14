import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Skeleton } from '@chakra-ui/react';
import CourseCard from '../course-card/courseCard';
import TabBar from '../TabBar/TabBar';
import { BACKEND_URL } from '../../utils/backendUrl';
import { BOARDS } from '../../utils/format';
import './courseSection.css';

const COURSES_PER_BOARD = 8;
const tabs = BOARDS.map((board) => ({ value: board.slug, label: board.label }));

const CourseSection = () => {
    const [selectedBoard, setSelectedBoard] = useState(tabs[0].value);
    const [courses, setCourses] = useState([]);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('loading');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        const loadCourses = async () => {
            setStatus('loading');
            try {
                const params = new URLSearchParams({ board: selectedBoard, limit: COURSES_PER_BOARD });
                const response = await fetch(`${BACKEND_URL}/api/courses/getCourseListing?${params}`, {
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                setCourses(data.courses || []);
                setTotal(data.pagination?.totalCourses ?? (data.courses || []).length);
                setStatus('ready');
            } catch (error) {
                if (error.name === 'AbortError') return;
                setCourses([]);
                setStatus('error');
            }
        };

        loadCourses();
        return () => controller.abort();
    }, [selectedBoard, reloadKey]);

    const boardLabel = tabs.find((tab) => tab.value === selectedBoard)?.label;

    return (
        <section className="course-section page page-section" aria-labelledby="course-section-title">
            <div className="course-section__head">
                <div className="section-heading">
                    <h2 id="course-section-title">Courses open for enrollment</h2>
                    <p>Pick your board to see current classes, who teaches them and what they cost each month.</p>
                </div>
            </div>

            <TabBar tabs={tabs} value={selectedBoard} onSelect={setSelectedBoard} label="Board" />

            <div className="course-section__results" aria-live="polite" aria-busy={status === 'loading'}>
                {status === 'loading' ? (
                    <div className="course-grid">
                        {Array.from({ length: 4 }, (_, index) => (
                            <Skeleton key={index} height="320px" borderRadius="16px" startColor="#eef2f8" endColor="#f7f9fc" />
                        ))}
                    </div>
                ) : status === 'error' ? (
                    <div className="course-section__empty">
                        <h3>Courses couldn't be loaded</h3>
                        <p>Check your connection and try again.</p>
                        <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
                            Try again
                        </Button>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="course-grid">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.courseId}
                                title={course.title}
                                fees={course.fees}
                                institute={course.instituteName}
                                teacherName={course.teacherName}
                                board={course.board}
                                imageUrl={course.imageUrl}
                                id={course.courseId}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="course-section__empty">
                        <h3>No {boardLabel} courses yet</h3>
                        <p>Institutes add new batches regularly. In the meantime, browse every course on AoParhein.</p>
                        <Button as={RouterLink} to="/courses" variant="outline">Browse all courses</Button>
                    </div>
                )}
            </div>

            {status === 'ready' && courses.length > 0 && (
                <div className="course-section__more">
                    <Button as={RouterLink} to={`/courses/${selectedBoard}`} variant="outline">
                        {total > courses.length ? `View all ${total} ${boardLabel} courses` : `Filter ${boardLabel} courses`}
                    </Button>
                </div>
            )}
        </section>
    );
};

export default CourseSection;
