import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, Skeleton, SkeletonText } from '@chakra-ui/react';
import { FiCalendar, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import Schedule from '../schedule/schedule';
import MapWithPlusCode from '../map/map';
import FeeTable from '../fee-table/FeeTable';
import CourseBatches from '../course-batches/courseBatches';
import PageTitle from '../page-title/PageTitle';
import { BACKEND_URL } from '../../utils/backendUrl';
import { formatBoard, formatClassFormat, formatMonths, formatRupees, normalizeBoard } from '../../utils/format';
import './courseDetails.css';

const SECTIONS = [
    { id: 'teacher', label: 'Teacher' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'location', label: 'Location' },
    { id: 'fees', label: 'Fees' },
];

const EnrollCard = ({ course }) => {
    const hasBatches = (course.batches || []).length > 0;
    const compareLink = course.subjectInfo && (
        <p className="enroll-card__compare">
            <RouterLink to={`/subjects/${course.subjectInfo.slug}`} className="text-link">Compare other institutes for {course.subjectInfo.title}</RouterLink>
        </p>
    );
    return (
        <div className="enroll-card">
            <p className="enroll-card__price">
                <strong>{formatRupees(course.fees)}</strong> / month
            </p>
            <p className="enroll-card__sub">
                Plus {formatRupees(course.institute?.registrationFees)} one-time registration
            </p>
            <Button
                as={RouterLink}
                to="/checkout"
                state={{ course }}
                size="lg"
                width="full"
                mt={5}
                isDisabled={!hasBatches}
                pointerEvents={hasBatches ? undefined : 'none'}
            >
                {hasBatches ? 'Reserve a seat' : 'No batches open yet'}
            </Button>
            <p className="enroll-card__note">
                {hasBatches
                    ? 'Nothing to pay online. You pay the institute on your first day.'
                    : 'This course has no open batch right now. Check back soon.'}
            </p>
            {compareLink}
        </div>
    );
};

const CourseDetails = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [status, setStatus] = useState('loading');

    const loadCourse = useCallback(async () => {
        setStatus('loading');
        try {
            const response = await fetch(`${BACKEND_URL}/api/courses/getCourseDetails/${courseId}`);
            if (response.status === 404) {
                setStatus('missing');
                return;
            }
            const data = await response.json();
            if (!response.ok || !data || typeof data !== 'object' || !data.title) {
                setStatus(response.ok ? 'missing' : 'error');
                return;
            }
            setCourse(data);
            setStatus('ready');
        } catch (error) {
            setStatus('error');
        }
    }, [courseId]);

    useEffect(() => {
        loadCourse();
    }, [loadCourse]);

    if (status === 'loading') {
        return (
            <div className="page course-page" aria-busy="true">
                <Skeleton height="16px" width="200px" mb={6} />
                <Skeleton height="40px" width="60%" mb={4} />
                <SkeletonText noOfLines={3} spacing={3} maxW="560px" />
            </div>
        );
    }

    if (status !== 'ready') {
        return (
            <div className="page course-page">
                <PageTitle title="Course not found" />
                <div className="course-page__state">
                    <h1>{status === 'missing' ? 'This course is no longer available' : "This course couldn't be loaded"}</h1>
                    <p>
                        {status === 'missing'
                            ? 'It may have been removed by the institute. Have a look at other courses instead.'
                            : 'Check your connection and try again.'}
                    </p>
                    {status === 'error' && <Button onClick={loadCourse} mr={3}>Try again</Button>}
                    <Button as={RouterLink} to="/courses" variant="outline">Browse courses</Button>
                </div>
            </div>
        );
    }

    const boardLabel = formatBoard(course.board);
    const batches = course.batches || [];
    const schedules = course.schedules || [];
    const facts = [
        course.teacher?.name && { icon: FiUser, label: 'Teacher', value: course.teacher.name, to: course.teacher.id ? `/teachers/${course.teacher.id}` : null },
        course.durationMonths && { icon: FiCalendar, label: 'Duration', value: formatMonths(course.durationMonths) },
        course.classFormat && { icon: FiClock, label: 'Classes', value: formatClassFormat(course.classFormat) },
        course.institute?.name && { icon: FiMapPin, label: 'Institute', value: course.institute.name, to: `/institute/${course.institute.id}` },
    ].filter(Boolean);

    return (
        <div className="page course-page">
            <PageTitle title={`${course.subjectInfo?.title || course.title}${course.institute?.name ? ` at ${course.institute.name}` : ''}`} />

            <nav className="breadcrumb" aria-label="Breadcrumb">
                <ol>
                    <li><RouterLink to="/courses">Find a class</RouterLink></li>
                    {boardLabel && <li><RouterLink to={`/courses/${normalizeBoard(course.board)}`}>{boardLabel}</RouterLink></li>}
                    {course.subjectInfo && <li><RouterLink to={`/subjects/${course.subjectInfo.slug}`}>{course.subjectInfo.title}</RouterLink></li>}
                    <li aria-current="page">{course.institute?.name || course.title}</li>
                </ol>
            </nav>

            <div className="course-page__layout">
                <div className="course-page__main">
                    <header className="course-hero">
                        {course.imageUrl && (
                            <div className="course-hero__image">
                                <img src={course.imageUrl} alt="" />
                            </div>
                        )}
                        {boardLabel && <p className="course-hero__board">{course.subjectInfo?.level || boardLabel}{course.label ? `, ${course.label}` : ''}</p>}
                        <h1>{course.subjectInfo?.title || course.title}</h1>
                        <p className="course-hero__byline">
                            {course.teacher?.name && <>with <RouterLink to={`/teachers/${course.teacher.id}`} className="text-link">{course.teacher.name}</RouterLink> </>}
                            {course.institute?.name && <>at <RouterLink to={`/institute/${course.institute.id}`} className="text-link">{course.institute.name}</RouterLink>{course.institute.area ? `, ${course.institute.area}` : ''}</>}
                        </p>
                        {course.description && <p className="course-hero__description">{course.description}</p>}

                        <dl className="course-facts">
                            {facts.map(({ icon: Icon, label, value, to }) => (
                                <div key={label}>
                                    <dt><Icon aria-hidden="true" />{label}</dt>
                                    <dd>{to ? <RouterLink to={to}>{value}</RouterLink> : value}</dd>
                                </div>
                            ))}
                        </dl>
                    </header>

                    <div className="course-page__enroll-mobile">
                        <EnrollCard course={course} />
                    </div>

                    <nav className="section-tabs" aria-label="On this page">
                        {SECTIONS.map((section) => (
                            <a key={section.id} href={`#${section.id}`}>{section.label}</a>
                        ))}
                    </nav>

                    <section id="teacher" className="course-section-block" aria-labelledby="teacher-title">
                        <h2 id="teacher-title">Teacher</h2>
                        <div className="teacher-row">
                            {course.teacher?.picture ? (
                                <img src={course.teacher.picture} alt="" className="teacher-row__photo" />
                            ) : (
                                <span className="teacher-row__photo teacher-row__photo--empty" aria-hidden="true" />
                            )}
                            <div>
                                <p className="teacher-row__name">
                                    {course.teacher?.id ? <RouterLink to={`/teachers/${course.teacher.id}`} className="text-link">{course.teacher.name}</RouterLink> : course.teacher?.name || 'To be announced'}
                                </p>
                                {Number(course.teacher?.experience) > 0 && (
                                    <p className="teacher-row__bio">{course.teacher.experience} {Number(course.teacher.experience) === 1 ? 'year' : 'years'} teaching</p>
                                )}
                                {course.teacher?.description && <p className="teacher-row__bio">{course.teacher.description}</p>}
                            </div>
                        </div>
                    </section>

                    <section id="timetable" className="course-section-block" aria-labelledby="timetable-title">
                        <h2 id="timetable-title">Timetable</h2>
                        <p className="course-section-block__intro">
                            {batches.length > 0
                                ? `${batches.length} ${batches.length === 1 ? 'batch' : 'batches'} for this course. You'll choose one when you reserve your seat.`
                                : 'No batches have been published for this course yet.'}
                        </p>
                        {batches.length > 0 && (
                            <>
                                <Schedule batches={batches} schedules={schedules} />
                                <div className="course-section-block__spacer" />
                                <CourseBatches batches={batches} schedules={schedules} />
                            </>
                        )}
                    </section>

                    <section id="location" className="course-section-block" aria-labelledby="location-title">
                        <h2 id="location-title">Location</h2>
                        {course.institute?.name && (
                            <p className="course-section-block__intro">
                                Classes are held at{' '}
                                <RouterLink to={`/institute/${course.institute.id}`} className="text-link">{course.institute.name}</RouterLink>
                                {course.institute.address ? `, ${course.institute.address}` : ''}.
                                {Array.isArray(course.institute.location) && course.institute.location.length === 2 && (
                                    <>
                                        {' '}
                                        <a
                                            className="text-link"
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${course.institute.location[1]},${course.institute.location[0]}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Get directions
                                        </a>
                                    </>
                                )}
                            </p>
                        )}
                        <div className="course-map">
                            <MapWithPlusCode plusCode={course.institute?.plusCode} coordinates={course.institute?.location} />
                        </div>
                    </section>

                    <section id="fees" className="course-section-block" aria-labelledby="fees-title">
                        <h2 id="fees-title">Fees</h2>
                        <FeeTable registrationFees={course.institute?.registrationFees} courseFees={course.fees} oneTimeCharges={course.externalCharges} />
                    </section>
                </div>

                <aside className="course-page__aside">
                    <EnrollCard course={course} />
                </aside>
            </div>
        </div>
    );
};

export default CourseDetails;
