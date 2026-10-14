import React, { useEffect, useState } from 'react';
import { Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription, AlertIcon, Button, Spinner } from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import FeeTable from '../fee-table/FeeTable';
import PageTitle from '../page-title/PageTitle';
import useUserStore from '../../store/useUserStore';
import { BACKEND_URL } from '../../utils/backendUrl';
import { formatBoard, formatClassFormat, formatMonths } from '../../utils/format';
import { batchColor, DAYS, describeStart, formatTimeRange } from '../../utils/schedule';
import './checkout.css';

const BatchOption = ({ batch, index, schedules, isSelected, onSelect }) => {
    const times = schedules
        .filter((schedule) => schedule.batchId === batch._id)
        .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day));

    return (
        <label className={`batch-option${isSelected ? ' is-selected' : ''}`}>
            <input
                type="radio"
                name="batch"
                value={batch._id}
                checked={isSelected}
                onChange={() => onSelect(batch._id)}
            />
            <span className="batch-option__swatch" style={{ background: batchColor(index).accent }} aria-hidden="true" />
            <span className="batch-option__body">
                <span className="batch-option__name">{batch.batchName}</span>
                {batch.startDate && <span className="batch-option__meta">{describeStart(batch.startDate)}</span>}
                {times.length > 0 ? (
                    <span className="batch-option__times">
                        {times.map((schedule) => (
                            <span key={schedule._id}>
                                {schedule.day.slice(0, 3)} {formatTimeRange(schedule.startHour, schedule.duration)}
                            </span>
                        ))}
                    </span>
                ) : (
                    <span className="batch-option__meta">Class times will be shared by the institute</span>
                )}
            </span>
        </label>
    );
};

const Checkout = () => {
    const location = useLocation();
    const course = location.state?.course;
    const batches = (course?.batches || []).filter((batch) => batch?._id);
    const schedules = course?.schedules || [];

    const [selectedBatch, setSelectedBatch] = useState(batches[0]?._id || '');
    const [submitState, setSubmitState] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const user = useUserStore((state) => state.user);
    const authUser = useUserStore((state) => state.authUser);
    const accessToken = useUserStore((state) => state.accessToken);
    const sessionChecked = useUserStore((state) => state.sessionChecked);
    const refreshSession = useUserStore((state) => state.refreshSession);

    useEffect(() => {
        setErrorMessage('');
    }, [selectedBatch]);

    // Checkout only makes sense when arriving from a course page.
    if (!course) {
        return <Navigate to="/courses" replace />;
    }

    const studentId = user?.student?._id;
    const isSignedIn = Boolean(studentId || authUser);
    const selected = batches.find((batch) => batch._id === selectedBatch);

    const submit = async () => {
        if (!selectedBatch || !studentId) return;
        setSubmitState('submitting');
        setErrorMessage('');

        const send = (token) =>
            fetch(`${BACKEND_URL}/api/enrollment/addEnrollment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ batchId: selectedBatch, studentId }),
            });

        try {
            let response = await send(accessToken);
            if (response.status === 401) {
                const session = await refreshSession();
                if (session?.token) response = await send(session.token);
            }

            if (response.ok) {
                setSubmitState('done');
                return;
            }

            const body = await response.json().catch(() => ({}));
            setErrorMessage(
                response.status === 401
                    ? 'Your session has expired. Log in again to reserve your seat.'
                    : body.error || body.message || 'Your seat could not be reserved. Please try again.'
            );
            setSubmitState('idle');
        } catch (error) {
            setErrorMessage('Your seat could not be reserved because the connection failed. Check your internet and try again.');
            setSubmitState('idle');
        }
    };

    if (submitState === 'done') {
        return (
            <div className="page checkout">
                <PageTitle title="Seat reserved" />
                <div className="checkout__done">
                    <FiCheckCircle className="checkout__done-icon" aria-hidden="true" />
                    <h1>Seat reserved</h1>
                    <p>
                        You're booked into <strong>{selected?.batchName}</strong> for <strong>{course.title}</strong>
                        {course.institute?.name ? ` at ${course.institute.name}` : ''}. Bring your fee to the institute on your first day.
                    </p>
                    <div className="checkout__done-actions">
                        <Button as={RouterLink} to="/student" size="lg">View my courses</Button>
                        <Button as={RouterLink} to="/courses" size="lg" variant="outline">Browse more courses</Button>
                    </div>
                </div>
            </div>
        );
    }

    const renderAction = () => {
        if (!sessionChecked) {
            return <div className="checkout__pending"><Spinner size="sm" color="brand.500" /> Checking your account…</div>;
        }

        if (!isSignedIn) {
            const returnState = { from: '/checkout', fromState: { course } };
            return (
                <>
                    <p className="checkout__hint">Log in or create a free student account to reserve this seat.</p>
                    <Button as={RouterLink} to="/login" state={returnState} size="lg" width="full">Log in to continue</Button>
                    <Button as={RouterLink} to="/signup" state={returnState} size="lg" width="full" variant="outline" mt={3}>
                        Create an account
                    </Button>
                </>
            );
        }

        if (!studentId) {
            return (
                <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <AlertDescription>Seats can only be reserved from a student account.</AlertDescription>
                </Alert>
            );
        }

        return (
            <>
                <Button
                    size="lg"
                    width="full"
                    onClick={submit}
                    isLoading={submitState === 'submitting'}
                    loadingText="Reserving your seat"
                    isDisabled={!selectedBatch}
                >
                    Reserve my seat
                </Button>
                <p className="checkout__hint checkout__hint--center">Nothing is charged online.</p>
            </>
        );
    };

    return (
        <div className="page checkout">
            <PageTitle title={`Reserve a seat: ${course.title}`} />
            <nav className="breadcrumb" aria-label="Breadcrumb">
                <ol>
                    <li><RouterLink to="/courses">Courses</RouterLink></li>
                    <li><RouterLink to={`/course-details/${course._id}`}>{course.title}</RouterLink></li>
                    <li aria-current="page">Reserve a seat</li>
                </ol>
            </nav>

            <h1 className="checkout__title">Reserve your seat</h1>

            <div className="checkout__layout">
                <section className="checkout__panel" aria-labelledby="batch-title">
                    <h2 id="batch-title">Choose a batch</h2>
                    <p className="checkout__panel-intro">Each batch meets at different times. Pick the one that fits your week.</p>
                    {batches.length > 0 ? (
                        <div className="batch-options" role="radiogroup" aria-labelledby="batch-title">
                            {batches.map((batch, index) => (
                                <BatchOption
                                    key={batch._id}
                                    batch={batch}
                                    index={index}
                                    schedules={schedules}
                                    isSelected={batch._id === selectedBatch}
                                    onSelect={setSelectedBatch}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="checkout__empty">This course has no open batches right now. Check back soon or contact the institute.</p>
                    )}
                </section>

                <aside className="checkout__summary" aria-labelledby="summary-title">
                    <h2 id="summary-title">Summary</h2>
                    <div className="checkout__course">
                        {course.imageUrl && <img src={course.imageUrl} alt="" />}
                        <div>
                            <p className="checkout__course-title">{course.title}</p>
                            <p className="checkout__course-meta">
                                {[formatBoard(course.board), course.institute?.name].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    </div>
                    <dl className="checkout__details">
                        {course.teacher?.name && (<><dt>Teacher</dt><dd>{course.teacher.name}</dd></>)}
                        {course.durationMonths && (<><dt>Duration</dt><dd>{formatMonths(course.durationMonths)}</dd></>)}
                        {course.classFormat && (<><dt>Classes</dt><dd>{formatClassFormat(course.classFormat)}</dd></>)}
                        {selected && (<><dt>Batch</dt><dd>{selected.batchName}</dd></>)}
                    </dl>
                    <FeeTable registrationFees={course.institute?.registrationFees} courseFees={course.fees} oneTimeCharges={course.externalCharges} />
                    <p className="checkout__pay-note">Pay this amount at the institute on your first day of class.</p>

                    {errorMessage && (
                        <Alert status="error" borderRadius="md" mb={4}>
                            <AlertIcon />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="checkout__action">{renderAction()}</div>
                </aside>
            </div>
        </div>
    );
};

export default Checkout;
