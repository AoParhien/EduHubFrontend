import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, Checkbox, FormControl, FormLabel, Select, Skeleton } from '@chakra-ui/react';
import OfferingCard from '../offering-card/OfferingCard';
import PageTitle from '../page-title/PageTitle';
import { BACKEND_URL } from '../../utils/backendUrl';
import { BOARDS } from '../../utils/format';
import { meetsOn, nextBatch, startsInEvening } from '../../utils/offering';
import '../course-details/courseDetails.css';
import './subjects.css';

const SORTS = {
  fee: { label: 'Lowest fee', compare: (a, b) => a.fees - b.fees },
  start: {
    label: 'Starting soonest',
    compare: (a, b) => new Date(nextBatch(a.batches)?.startDate || 8.64e15) - new Date(nextBatch(b.batches)?.startDate || 8.64e15),
  },
  experience: { label: 'Most experienced teacher', compare: (a, b) => (b.teacher?.experience || 0) - (a.teacher?.experience || 0) },
};

// Every institute teaching one subject, side by side.
const SubjectPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [area, setArea] = useState('all');
  const [days, setDays] = useState('any');
  const [eveningOnly, setEveningOnly] = useState(false);
  const [sort, setSort] = useState('fee');

  useEffect(() => {
    setStatus('loading');
    fetch(`${BACKEND_URL}/api/catalog/subjects/${slug}`)
      .then(async (res) => {
        if (res.status === 404) return setStatus('missing');
        if (!res.ok) throw new Error(res.status);
        setData(await res.json());
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [slug]);

  const areas = useMemo(
    () => [...new Set((data?.offerings || []).map((o) => o.institute.area).filter(Boolean))].sort(),
    [data]
  );

  const visible = useMemo(() => {
    if (!data) return [];
    return data.offerings
      .filter((o) => area === 'all' || o.institute.area === area)
      .filter((o) => meetsOn(o, days))
      .filter((o) => !eveningOnly || startsInEvening(o))
      .sort(SORTS[sort].compare);
  }, [data, area, days, eveningOnly, sort]);

  if (status === 'loading') {
    return (
      <div className="page subject-page">
        <Skeleton h="40px" w="50%" mb={6} />
        <Skeleton h="420px" borderRadius="16px" />
      </div>
    );
  }

  if (status !== 'ready') {
    return (
      <div className="page subject-page">
        <PageTitle title="Subject not found" />
        <div className="course-page__state">
          <h1>{status === 'missing' ? 'This subject isn’t listed' : 'This subject couldn’t be loaded'}</h1>
          <p>Browse subjects by board instead.</p>
          <Button as={RouterLink} to="/courses">Find a class</Button>
        </div>
      </div>
    );
  }

  const { subject, offerings } = data;
  const board = BOARDS.find((item) => item.slug === subject.board);
  const instituteCount = new Set(offerings.map((o) => o.institute._id)).size;
  const filtersActive = area !== 'all' || days !== 'any' || eveningOnly;

  return (
    <div className="page subject-page">
      <PageTitle title={subject.title} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><RouterLink to="/courses">Find a class</RouterLink></li>
          {board && <li><RouterLink to={`/courses/${board.slug}`}>{board.label}</RouterLink></li>}
          <li aria-current="page">{subject.name}</li>
        </ol>
      </nav>

      <header className="subject-page__header">
        <p className="subject-page__level">{subject.level}</p>
        <h1>{subject.title}</h1>
        <p>
          {offerings.length
            ? `${offerings.length} ${offerings.length === 1 ? 'class' : 'classes'} at ${instituteCount} ${instituteCount === 1 ? 'institute' : 'institutes'} in Karachi. Compare teachers, timings and fees, then reserve a seat.`
            : 'No institute lists this subject yet. Institutes are joining every week, so check back soon.'}
        </p>
      </header>

      {offerings.length > 0 && (
        <>
          <div className="subject-filters" role="group" aria-label="Filter classes">
            <FormControl w="auto">
              <FormLabel htmlFor="filter-area" fontSize="sm" mb={1}>Area</FormLabel>
              <Select id="filter-area" size="sm" value={area} onChange={(e) => setArea(e.target.value)} borderRadius="md" minW="170px">
                <option value="all">All areas</option>
                {areas.map((item) => <option key={item} value={item}>{item}</option>)}
              </Select>
            </FormControl>
            <FormControl w="auto">
              <FormLabel htmlFor="filter-days" fontSize="sm" mb={1}>Classes on</FormLabel>
              <Select id="filter-days" size="sm" value={days} onChange={(e) => setDays(e.target.value)} borderRadius="md">
                <option value="any">Any day</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
              </Select>
            </FormControl>
            <FormControl w="auto">
              <FormLabel htmlFor="filter-sort" fontSize="sm" mb={1}>Sort by</FormLabel>
              <Select id="filter-sort" size="sm" value={sort} onChange={(e) => setSort(e.target.value)} borderRadius="md">
                {Object.entries(SORTS).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
              </Select>
            </FormControl>
            <Checkbox isChecked={eveningOnly} onChange={(e) => setEveningOnly(e.target.checked)} mb={1.5}>
              Evening (5 pm or later)
            </Checkbox>
            <span className="subject-filters__count" aria-live="polite">
              {visible.length} of {offerings.length} {offerings.length === 1 ? 'class' : 'classes'}
            </span>
          </div>

          {visible.length ? (
            <ul className="offering-list">
              {visible.map((offering) => (
                <li key={offering.courseId}><OfferingCard offering={offering} /></li>
              ))}
            </ul>
          ) : (
            <div className="directory__empty">
              <h2>No classes match these filters</h2>
              <p>Try another area or day.</p>
              {filtersActive && (
                <Button variant="outline" onClick={() => { setArea('all'); setDays('any'); setEveningOnly(false); }}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {offerings.length === 0 && board && (
        <Button as={RouterLink} to={`/courses/${board.slug}`} variant="outline">See other {board.label} subjects</Button>
      )}
    </div>
  );
};

export default SubjectPage;
