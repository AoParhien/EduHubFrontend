import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Skeleton } from '@chakra-ui/react';
import TabBar from '../TabBar/TabBar';
import SubjectCard from '../subject-art/SubjectCard';
import { BACKEND_URL } from '../../utils/backendUrl';
import { BOARDS } from '../../utils/format';
import '../subjects/subjects.css';
import './courseSection.css';

const SUBJECTS_PER_BOARD = 8;
const tabs = BOARDS.map((board) => ({ value: board.slug, label: board.label }));

// Home page: the most-offered subjects for a board, each linking to a comparison page.
const CourseSection = () => {
    const [board, setBoard] = useState(tabs[0].value);
    const [subjects, setSubjects] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setSubjects(null);
        setError(false);
        fetch(`${BACKEND_URL}/api/catalog/subjects?board=${board}`, { signal: controller.signal })
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
            .then((data) =>
                setSubjects(
                    data
                        .filter((subject) => subject.offerings > 0)
                        .sort((a, b) => b.institutes - a.institutes || a.minFee - b.minFee)
                )
            )
            .catch((err) => {
                if (err.name !== 'AbortError') setError(true);
            });
        return () => controller.abort();
    }, [board, reloadKey]);

    const boardLabel = tabs.find((tab) => tab.value === board)?.label;
    const shown = (subjects || []).slice(0, SUBJECTS_PER_BOARD);

    return (
        <section className="course-section page page-section" aria-labelledby="course-section-title">
            <div className="section-heading">
                <h2 id="course-section-title">Find your subject</h2>
                <p>Pick a board, then a subject, to compare every institute in Karachi that teaches it.</p>
            </div>

            <TabBar tabs={tabs} value={board} onSelect={setBoard} label="Board" />

            <div className="course-section__results" aria-live="polite" aria-busy={!subjects && !error}>
                {error ? (
                    <div className="course-section__empty">
                        <h3>Subjects couldn't be loaded</h3>
                        <p>Check your connection and try again.</p>
                        <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>Try again</Button>
                    </div>
                ) : !subjects ? (
                    <div className="subject-grid">
                        {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} h="250px" borderRadius="16px" startColor="#eef2f8" endColor="#f7f9fc" />)}
                    </div>
                ) : shown.length ? (
                    <ul className="subject-grid">
                        {shown.map((subject) => (
                            <li key={subject.slug}><SubjectCard subject={subject} /></li>
                        ))}
                    </ul>
                ) : (
                    <div className="course-section__empty">
                        <h3>No {boardLabel} classes yet</h3>
                        <p>Institutes are joining AoParhein every week. Try another board in the meantime.</p>
                    </div>
                )}
            </div>

            <div className="course-section__more">
                <Button as={RouterLink} to={`/courses/${board}`} variant="outline">
                    See all {boardLabel} subjects
                </Button>
            </div>
        </section>
    );
};

export default CourseSection;
