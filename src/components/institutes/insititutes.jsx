import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, InputGroup, InputLeftElement, Skeleton } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import InstituteCard from '../institute-card/instituteCard';
import PageTitle from '../page-title/PageTitle';
import { BACKEND_URL } from '../../utils/backendUrl';
import './institutes.css';

const Institutes = () => {
    const [institutes, setInstitutes] = useState([]);
    const [status, setStatus] = useState('loading');
    const [query, setQuery] = useState('');

    const loadInstitutes = useCallback(async () => {
        setStatus('loading');
        try {
            const response = await fetch(`${BACKEND_URL}/api/institutes/getInstitutes`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            setInstitutes(Array.isArray(data) ? data : []);
            setStatus('ready');
        } catch (error) {
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        loadInstitutes();
    }, [loadInstitutes]);

    const visible = useMemo(() => {
        const term = query.trim().toLowerCase();
        const sorted = [...institutes].sort((a, b) => a.name.localeCompare(b.name));
        return term ? sorted.filter((institute) => institute.name.toLowerCase().includes(term)) : sorted;
    }, [institutes, query]);

    return (
        <div className="page institutes">
            <PageTitle title="Institutes" />
            <header className="institutes__header">
                <div>
                    <h1>Institutes</h1>
                    <p>Tuition centres and colleges offering classes on AoParhein. Open one to see its courses, teachers and location.</p>
                </div>
                <InputGroup size="lg" maxW={{ base: '100%', md: '320px' }}>
                    <InputLeftElement pointerEvents="none" color="muted"><FiSearch /></InputLeftElement>
                    <Input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Filter by name"
                        aria-label="Filter institutes by name"
                        fontSize="md"
                        borderRadius="full"
                    />
                </InputGroup>
            </header>

            <div aria-live="polite" aria-busy={status === 'loading'}>
                {status === 'loading' ? (
                    <div className="institutes__grid">
                        {Array.from({ length: 6 }, (_, index) => (
                            <Skeleton key={index} height="280px" borderRadius="16px" startColor="#eef2f8" endColor="#f7f9fc" />
                        ))}
                    </div>
                ) : status === 'error' ? (
                    <div className="institutes__empty">
                        <h2>Institutes couldn't be loaded</h2>
                        <p>Check your connection and try again.</p>
                        <Button onClick={loadInstitutes}>Try again</Button>
                    </div>
                ) : visible.length === 0 ? (
                    <div className="institutes__empty">
                        <h2>{query ? `No institutes match "${query}"` : 'No institutes yet'}</h2>
                        {query && <Button variant="outline" mt={4} onClick={() => setQuery('')}>Clear filter</Button>}
                    </div>
                ) : (
                    <ul className="institutes__grid">
                        {visible.map((institute) => (
                            <li key={institute._id}>
                                <InstituteCard
                                    _id={institute._id}
                                    name={institute.name}
                                    registrationFees={institute.registrationFees}
                                    pictureUrl={institute.pictureUrl}
                                    logoUrl={institute.logoUrl}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Institutes;
