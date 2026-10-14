import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, Skeleton, SkeletonText } from '@chakra-ui/react';
import Schedule from '../schedule/schedule';
import MapWithPlusCode from '../map/map';
import CourseBatches from '../course-batches/courseBatches';
import PageTitle from '../page-title/PageTitle';
import { BACKEND_URL } from '../../utils/backendUrl';
import { formatBoard, formatClassFormat, formatMonths, formatRupees, normalizeBoard } from '../../utils/format';
import './courseDetails.css';

// Price, what's due on day one and the reserve button. The only place fees appear.
const EnrollCard = ({ course }) => {
    const hasBatches = (course.batches || []).length > 0;
    const registration = Number(course.institute?.registrationFees || 0);
    const oneTime = Number(course.externalCharges || 0);
    const dueFirstDay = Number(course.fees || 0) + registration + oneTime;

    return (
        <div className="enroll-card">
            <p className="enroll-card__price">
                <strong>{formatRupees(course.fees)}</strong> / month
            </p>
            <dl className="enroll-card__breakdown">
                <div><dt>Registration, one time</dt><dd>{formatRupees(registration)}</dd></div>
                {oneTime > 0 && <div><dt>Books and materials, one time</dt><dd>{formatRupees(oneTime)}</dd></div>}
                <div className="enroll-card__total"><dt>Due on your first day</dt><dd>{formatRupees(dueFirstDay)}</dd></div>
            </dl>
            <Button
                as={RouterLink}
                to="/checkout"
                state={{ course }}
                size="lg"
                width="full"
                mt={4}
                isDisabled={!hasBatches}
                pointerEvents={hasBatches ? undefined : 'none'}
            >
                {hasBatches ? 'Reserve a seat' : 'No batches open yet'}
            </Button>
            <p className="enroll-card__note">
                {hasBatches ? 'Nothing to pay online.' : 'Check back soon for a new batch.'}
            </p>
            {course.subjectInfo && (
                <p className="enroll-card__compare">
                    <RouterLink to={`/subjects/${course.subjectInfo.slug}`} className="text-link">
                        Compare other institutes for this subject
                    </RouterLink>
                </p>
            )}
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
    const hasTimes = schedules.length > 0;
    const teacher = course.teacher;
    const institute = course.institute || {};
    const years = Number(teacher?.experience) || 0;
    const coords = Array.isArray(institute.location) && institute.location.length === 2 ? institute.location : null;
    const meta = [
        course.durationMonths && formatMonths(course.durationMonths),
        course.classFormat && `${formatClassFormat(course.classFormat)} classes`,
        batches.length > 0 && `${batches.length} ${batches.length === 1 ? 'batch' : 'batches'}`,
    ].filter(Boolean);

    return (
        <div className="page course-page">
            <PageTitle title={`${course.subjectInfo?.title || course.title}${institute.name ? ` at ${institute.name}` : ''}`} />

            <nav className="breadcrumb" aria-label="Breadcrumb">
                <ol>
                    <li><RouterLink to="/courses">Find a class</RouterLink></li>
                    {boardLabel && <li><RouterLink to={`/courses/${normalizeBoard(course.board)}`}>{boardLabel}</RouterLink></li>}
                    {course.subjectInfo && <li><RouterLink to={`/subjects/${course.subjectInfo.slug}`}>{course.subjectInfo.name || course.subjectInfo.title}</RouterLink></li>}
                    <li aria-current="page">{institute.name || course.title}</li>
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
                        <h1>
                            {course.subjectInfo?.title || course.title}
                            {course.label && <span className="course-hero__label">{course.label}</span>}
                        </h1>
                        {meta.length > 0 && <p className="course-hero__meta">{meta.join(' · ')}</p>}

                        <div className="course-hero__people">
                            {teacher?.name && (
                                <div className="course-hero__teacher">
                                    {teacher.picture
                                        ? <img src={teacher.picture} alt="" />
                                        : <span className="course-hero__avatar-empty" aria-hidden="true">{teacher.name[0]}</span>}
                                    <div>
                                        <p>
                                            <RouterLink to={`/teachers/${teacher.id}`} className="course-hero__name">{teacher.name}</RouterLink>
                                            {years > 0 && <span className="course-hero__muted">, {years} {years === 1 ? 'year' : 'years'} teaching</span>}
                                        </p>
                                        {teacher.description && <p className="course-hero__muted">{teacher.description}</p>}
                                    </div>
                                </div>
                            )}
                            {institute.name && (
                                <p className="course-hero__institute">
                                    at <RouterLink to={`/institute/${institute.id}`} className="course-hero__name">{institute.name}</RouterLink>
                                    {institute.area && <span className="course-hero__muted">, {institute.area}</span>}
                                </p>
                            )}
                        </div>

                        {course.description && <p className="course-hero__description">{course.description}</p>}
                    </header>

                    <div className="course-page__enroll-mobile">
                        <EnrollCard course={course} />
                    </div>

                    <section id="timetable" className="course-section-block" aria-labelledby="timetable-title">
                        <h2 id="timetable-title">Timetable</h2>
                        {batches.length === 0 ? (
                            <p className="course-section-block__intro">No batches have been published yet.</p>
                        ) : (
                            <>
                                <p className="course-section-block__intro">You'll pick one batch when you reserve your seat.</p>
                                {hasTimes && <Schedule batches={batches} schedules={schedules} />}
                                <CourseBatches batches={batches} schedules={schedules} compact={hasTimes} />
                            </>
                        )}
                    </section>

                    <section id="location" className="course-section-block" aria-labelledby="location-title">
                        <h2 id="location-title">Where classes are held</h2>
                        {(institute.address || coords) && (
                            <p className="course-section-block__intro">
                                {institute.address}
                                {institute.address && coords ? '. ' : ''}
                                {coords && (
                                    <a
                                        className="text-link"
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Get directions
                                    </a>
                                )}
                            </p>
                        )}
                        <div className="course-map">
                            <MapWithPlusCode plusCode={institute.plusCode} coordinates={institute.location} />
                        </div>
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
