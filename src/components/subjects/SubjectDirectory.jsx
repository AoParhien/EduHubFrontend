import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Input, InputGroup, InputLeftElement, Skeleton } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import TabBar from '../TabBar/TabBar';
import PageTitle from '../page-title/PageTitle';
import { BACKEND_URL } from '../../utils/backendUrl';
import { BOARDS, formatRupees, normalizeBoard } from '../../utils/format';
import './subjects.css';

const boardFromParam = (param) => {
  const key = normalizeBoard(param || '');
  return BOARDS.find((board) => board.slug === key || normalizeBoard(board.label) === key)?.slug || BOARDS[0].slug;
};

// Board -> level -> subject. Each subject links to a page comparing every institute that teaches it.
const SubjectDirectory = () => {
  const { subcategory } = useParams();
  const navigate = useNavigate();
  const board = boardFromParam(subcategory);
  const boardInfo = BOARDS.find((item) => item.slug === board);
  const [subjects, setSubjects] = useState(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [showEmpty, setShowEmpty] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setSubjects(null);
    setError(false);
    fetch(`${BACKEND_URL}/api/catalog/subjects?board=${board}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
      .then(setSubjects)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, [board]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (subjects || []).filter((subject) => (showEmpty || subject.offerings > 0) && (!term || subject.name.toLowerCase().includes(term)));
  }, [subjects, query, showEmpty]);

  const withClasses = (subjects || []).filter((subject) => subject.offerings > 0).length;

  return (
    <div className="page directory">
      <PageTitle title={`${boardInfo.label} subjects`} />
      <header className="directory__header">
        <h1>Find a class</h1>
        <p>Choose your board and subject to compare every institute that teaches it, by teacher, area, timing and fee.</p>
      </header>

      <TabBar
        tabs={BOARDS.map((item) => ({ value: item.slug, label: item.label }))}
        value={board}
        onSelect={(slug) => navigate(`/courses/${slug}`)}
        label="Board"
      />

      <div className="directory__tools">
        <InputGroup maxW={{ base: '100%', md: '320px' }}>
          <InputLeftElement pointerEvents="none" color="muted"><FiSearch /></InputLeftElement>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${boardInfo.label} subjects`}
            aria-label="Filter subjects"
            borderRadius="full"
          />
        </InputGroup>
        {subjects && (
          <p className="directory__count">
            {withClasses} of {subjects.length} subjects have classes on AoParhein
          </p>
        )}
      </div>

      {error && (
        <div className="directory__empty">
          <h2>Subjects couldn't be loaded</h2>
          <p>Check your connection and try again.</p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      )}

      {!subjects && !error && (
        <div className="subject-grid">
          {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} h="92px" borderRadius="16px" startColor="#eef2f8" endColor="#f7f9fc" />)}
        </div>
      )}

      {subjects && (
        <>
          {boardInfo.levels.map((level) => {
            const items = visible.filter((subject) => subject.level === level);
            if (!items.length) return null;
            return (
              <section key={level} className="directory__level" aria-labelledby={`level-${level}`}>
                {boardInfo.levels.length > 1 && <h2 id={`level-${level}`}>{level}</h2>}
                <ul className="subject-grid">
                  {items.map((subject) => (
                    <li key={subject.slug}>
                      <Link to={`/subjects/${subject.slug}`} className={`subject-tile${subject.offerings ? '' : ' is-empty'}`}>
                        <span className="subject-tile__name">{subject.name}</span>
                        <span className="subject-tile__meta">
                          {subject.offerings
                            ? `${subject.institutes} ${subject.institutes === 1 ? 'institute' : 'institutes'}, from ${formatRupees(subject.minFee)}`
                            : 'No classes listed yet'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {visible.length === 0 && (
            <div className="directory__empty">
              <h2>{query ? `No ${boardInfo.label} subjects match "${query}"` : `No ${boardInfo.label} classes listed yet`}</h2>
              <p>Institutes are joining AoParhein every week. Try another board, or see subjects without classes yet.</p>
            </div>
          )}
          {!showEmpty && subjects.length > withClasses && (
            <Button variant="link" mt={6} onClick={() => setShowEmpty(true)}>
              Show subjects with no classes yet
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default SubjectDirectory;
