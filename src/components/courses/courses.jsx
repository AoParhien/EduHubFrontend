import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Skeleton,
    useDisclosure,
} from '@chakra-ui/react';
import { FiSliders, FiX } from 'react-icons/fi';
import debounce from 'lodash.debounce';
import FilterSidebar, { DEFAULT_FILTERS, FEE_LIMIT } from '../filter-sidebar/filterSidebar';
import CourseCard from '../course-card/courseCard';
import PageTitle from '../page-title/PageTitle';
import { BACKEND_URL } from '../../utils/backendUrl';
import { BOARDS, formatBoard, formatRupees, normalizeBoard } from '../../utils/format';
import './courses.css';

const PAGE_SIZE = 12;

const boardFromParam = (param) => {
    if (!param) return [];
    const key = normalizeBoard(param);
    const match = BOARDS.find((board) => board.slug === key || normalizeBoard(board.label) === key);
    return [match ? match.slug : key];
};

const buildQuery = (filters, page) => {
    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (filters.institute !== 'Any') params.set('instituteName', filters.institute);
    if (filters.subject !== 'Any') params.set('subject', filters.subject);
    if (Number(filters.fees.max) < FEE_LIMIT) params.set('maxFees', filters.fees.max);
    (filters.board || []).forEach((board) => params.append('board', board));
    return params.toString();
};

const Courses = () => {
    const { subcategory } = useParams();
    const [filters, setFilters] = useState(() => ({ ...DEFAULT_FILTERS, board: boardFromParam(subcategory) }));
    const [page, setPage] = useState(1);
    const [courses, setCourses] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1, totalCourses: 0 });
    const [status, setStatus] = useState('loading');
    const filterDrawer = useDisclosure();
    const resultsRef = useRef(null);
    const requestRef = useRef(0);

    // A new board in the URL (e.g. from the navbar) starts a fresh search for that board.
    useEffect(() => {
        setFilters({ ...DEFAULT_FILTERS, board: boardFromParam(subcategory) });
        setPage(1);
    }, [subcategory]);

    const loadCourses = useCallback(async (activeFilters, activePage) => {
        const requestId = ++requestRef.current;
        setStatus('loading');
        try {
            const response = await fetch(`${BACKEND_URL}/api/courses/getCourseListing?${buildQuery(activeFilters, activePage)}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (requestId !== requestRef.current) return;
            const list = Array.isArray(data.courses) ? data.courses : [];
            setCourses(list);
            setPagination({
                totalPages: data.pagination?.totalPages || 1,
                totalCourses: data.pagination?.totalCourses ?? list.length,
            });
            setStatus('ready');
        } catch (error) {
            if (requestId !== requestRef.current) return;
            setCourses([]);
            setStatus('error');
        }
    }, []);

    // Debounce so dragging the fee slider doesn't fire a request per step.
    const debouncedLoad = useMemo(() => debounce(loadCourses, 250), [loadCourses]);
    useEffect(() => () => debouncedLoad.cancel(), [debouncedLoad]);

    useEffect(() => {
        debouncedLoad(filters, page);
    }, [filters, page, debouncedLoad]);

    const handleFilterChange = (next) => {
        setFilters(next);
        setPage(1);
    };

    const goToPage = (nextPage) => {
        setPage(nextPage);
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const activeChips = [
        ...(filters.board || []).map((slug) => ({
            key: `board-${slug}`,
            label: formatBoard(slug),
            remove: () => handleFilterChange({ ...filters, board: filters.board.filter((b) => b !== slug) }),
        })),
        filters.subject !== 'Any' && {
            key: 'subject',
            label: filters.subject,
            remove: () => handleFilterChange({ ...filters, subject: 'Any' }),
        },
        filters.institute !== 'Any' && {
            key: 'institute',
            label: filters.institute,
            remove: () => handleFilterChange({ ...filters, institute: 'Any' }),
        },
        Number(filters.fees.max) < FEE_LIMIT && {
            key: 'fees',
            label: `Up to ${formatRupees(filters.fees.max)}`,
            remove: () => handleFilterChange({ ...filters, fees: { ...filters.fees, max: FEE_LIMIT } }),
        },
    ].filter(Boolean);

    const singleBoard = filters.board?.length === 1 ? formatBoard(filters.board[0]) : null;
    const heading = singleBoard ? `${singleBoard} courses` : 'All courses';

    return (
        <div className="catalog page">
            <PageTitle title={heading} />
            <header className="catalog__header">
                <h1>{heading}</h1>
                <p>Compare classes by board, subject, institute and monthly fee.</p>
            </header>

            <div className="catalog__layout">
                <aside className="catalog__filters" aria-label="Filters">
                    <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
                </aside>

                <section className="catalog__results" ref={resultsRef} aria-live="polite" aria-busy={status === 'loading'}>
                    <div className="catalog__toolbar">
                        <p className="catalog__count">
                            {status === 'ready'
                                ? `${pagination.totalCourses} ${pagination.totalCourses === 1 ? 'course' : 'courses'}`
                                : status === 'loading' ? 'Loading courses…' : ''}
                        </p>
                        <Button
                            className="catalog__filter-button"
                            leftIcon={<FiSliders />}
                            variant="outline"
                            onClick={filterDrawer.onOpen}
                        >
                            Filters{activeChips.length > 0 ? ` (${activeChips.length})` : ''}
                        </Button>
                    </div>

                    {activeChips.length > 0 && (
                        <ul className="catalog__chips" aria-label="Active filters">
                            {activeChips.map((chip) => (
                                <li key={chip.key}>
                                    <button type="button" onClick={chip.remove} aria-label={`Remove filter: ${chip.label}`}>
                                        {chip.label}
                                        <FiX aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button type="button" className="catalog__clear" onClick={() => handleFilterChange(DEFAULT_FILTERS)}>
                                    Clear all
                                </button>
                            </li>
                        </ul>
                    )}

                    {status === 'loading' && courses.length === 0 ? (
                        <div className="course-grid">
                            {Array.from({ length: 6 }, (_, index) => (
                                <Skeleton key={index} height="320px" borderRadius="16px" startColor="#eef2f8" endColor="#f7f9fc" />
                            ))}
                        </div>
                    ) : status === 'error' ? (
                        <div className="catalog__empty">
                            <h2>Courses couldn't be loaded</h2>
                            <p>Check your connection and try again.</p>
                            <Button onClick={() => loadCourses(filters, page)}>Try again</Button>
                        </div>
                    ) : status === 'ready' && courses.length === 0 ? (
                        <div className="catalog__empty">
                            <h2>No courses match these filters</h2>
                            <p>Try removing a filter or raising the fee limit.</p>
                            <Button variant="outline" onClick={() => handleFilterChange(DEFAULT_FILTERS)}>
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        <div className={`course-grid${status === 'loading' ? ' is-refreshing' : ''}`}>
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
                    )}

                    {pagination.totalPages > 1 && courses.length > 0 && (
                        <nav className="catalog__pagination" aria-label="Pagination">
                            <Button variant="outline" onClick={() => goToPage(page - 1)} isDisabled={page <= 1}>
                                Previous
                            </Button>
                            <span>Page {page} of {pagination.totalPages}</span>
                            <Button variant="outline" onClick={() => goToPage(page + 1)} isDisabled={page >= pagination.totalPages}>
                                Next
                            </Button>
                        </nav>
                    )}
                </section>
            </div>

            <Drawer isOpen={filterDrawer.isOpen} placement="bottom" onClose={filterDrawer.onClose}>
                <DrawerOverlay />
                <DrawerContent borderTopRadius="20px" maxH="85vh">
                    <DrawerCloseButton top={4} />
                    <DrawerHeader borderBottomWidth="1px" borderColor="line">Filters</DrawerHeader>
                    <DrawerBody py={6}>
                        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
                    </DrawerBody>
                    <DrawerFooter borderTopWidth="1px" borderColor="line">
                        <Button width="full" size="lg" onClick={filterDrawer.onClose}>
                            {status === 'ready' ? `Show ${pagination.totalCourses} ${pagination.totalCourses === 1 ? 'course' : 'courses'}` : 'Show courses'}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default Courses;
