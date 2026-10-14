import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerOverlay,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { FiChevronDown, FiMenu, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Dblue from '../../assets/Dblue.png';
import useUserStore from '../../store/useUserStore';
import { BACKEND_URL } from '../../utils/backendUrl';
import './navbar.css';

const INSTITUTE_SIGNUP_URL =
    process.env.REACT_APP_INSTITUTE_SIGNUP_URL ||
    process.env.VITE_INSTITUTE_SIGNUP_URL ||
    'mailto:aoparhien@gmail.com?subject=List%20my%20institute%20on%20AoParhein';

const EMPTY_RESULTS = { subjects: [], teachers: [], institutes: [] };

// Searches subjects, teachers and institutes. Enter opens the first result.
const SiteSearch = ({ onNavigate, inputId = 'site-search' }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(EMPTY_RESULTS);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const runSearch = useMemo(
        () =>
            debounce(async (value) => {
                try {
                    const response = await axios.get(`${BACKEND_URL}/api/catalog/search`, { params: { q: value } });
                    setResults({ ...EMPTY_RESULTS, ...response.data });
                } catch (error) {
                    setResults(EMPTY_RESULTS);
                } finally {
                    setIsLoading(false);
                }
            }, 250),
        []
    );

    useEffect(() => () => runSearch.cancel(), [runSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        setQuery(value);
        if (value.trim().length < 2) {
            runSearch.cancel();
            setResults(EMPTY_RESULTS);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }
        setIsOpen(true);
        setIsLoading(true);
        runSearch(value.trim());
    };

    const items = [
        ...results.subjects.map((s) => ({ key: `s-${s.slug}`, to: `/subjects/${s.slug}`, title: s.title, meta: 'Subject' })),
        ...results.teachers.map((t) => ({ key: `t-${t._id}`, to: `/teachers/${t._id}`, title: t.name, meta: 'Teacher' })),
        ...results.institutes.map((i) => ({ key: `i-${i._id}`, to: `/institute/${i._id}`, title: i.name, meta: i.area ? `Institute, ${i.area}` : 'Institute' })),
    ];

    const go = useCallback((to) => {
        setQuery('');
        setResults(EMPTY_RESULTS);
        setIsOpen(false);
        navigate(to);
        onNavigate?.();
    }, [navigate, onNavigate]);

    return (
        <div className="nav-search" ref={containerRef}>
            <form role="search" onSubmit={(event) => { event.preventDefault(); if (items[0]) go(items[0].to); }}>
                <label htmlFor={inputId} className="visually-hidden">Search subjects, teachers and institutes</label>
                <FiSearch className="nav-search__icon" aria-hidden="true" />
                <input
                    id={inputId}
                    type="search"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
                    onKeyDown={(event) => event.key === 'Escape' && setIsOpen(false)}
                    placeholder="Subject, teacher or institute"
                    autoComplete="off"
                />
            </form>
            {isOpen && (
                <div className="nav-search__results" role="listbox" aria-label="Search results">
                    {isLoading ? (
                        <p className="nav-search__status">Searching…</p>
                    ) : items.length ? (
                        items.map((item) => (
                            <button type="button" role="option" aria-selected="false" key={item.key} className="nav-search__result" onClick={() => go(item.to)}>
                                <span className="nav-search__result-title">{item.title}</span>
                                <span className="nav-search__result-meta">{item.meta}</span>
                            </button>
                        ))
                    ) : (
                        <p className="nav-search__status">Nothing matches "{query}". Try a subject such as Physics.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const user = useUserStore((state) => state.user);
    const authUser = useUserStore((state) => state.authUser);
    const logout = useUserStore((state) => state.logout);

    const isSignedIn = Boolean(user?.student || authUser);
    const firstName = user?.student?.firstName;
    const accountLabel = firstName || authUser?.email || 'Account';

    // Close the mobile menu whenever the route changes.
    useEffect(() => {
        onClose();
    }, [location.pathname, onClose]);

    const handleLogout = async () => {
        await logout();
        onClose();
        navigate('/');
    };

    const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`;

    return (
        <header className="nav">
            <a href="#main" className="nav-skip">Skip to content</a>
            <div className="nav__bar">
                <RouterLink to="/" className="nav__logo" aria-label="AoParhein home">
                    <img src={Dblue} alt="AoParhein" />
                </RouterLink>

                <div className="nav__search-desktop">
                    <SiteSearch />
                </div>

                <nav className="nav__links" aria-label="Main">
                    <NavLink to="/courses" className={navLinkClass}>Find a class</NavLink>
                    <NavLink to="/teachers" className={navLinkClass}>Teachers</NavLink>
                    <NavLink to="/institutes" className={navLinkClass}>Institutes</NavLink>
                    {!isSignedIn && (
                        <a href={INSTITUTE_SIGNUP_URL} className="nav-link" target={INSTITUTE_SIGNUP_URL.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                            List your institute
                        </a>
                    )}
                </nav>

                <div className="nav__actions">
                    {isSignedIn ? (
                        <Menu placement="bottom-end">
                            <MenuButton as={Button} variant="ghost" rightIcon={<FiChevronDown />} fontWeight="500" color="ink" px={3}>
                                <Text as="span" maxW="160px" noOfLines={1}>{accountLabel}</Text>
                            </MenuButton>
                            <MenuList borderColor="line" boxShadow="raise" py={2}>
                                <MenuItem as={RouterLink} to="/student">My courses</MenuItem>
                                <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                                <MenuDivider />
                                <MenuItem onClick={handleLogout}>Log out</MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <>
                            <Button as={RouterLink} to="/login" state={{ from: location.pathname }} variant="ghost" color="brand.500" fontWeight="500">
                                Log in
                            </Button>
                            <Button as={RouterLink} to="/signup">Sign up</Button>
                        </>
                    )}
                </div>

                <IconButton
                    className="nav__menu-button"
                    icon={<FiMenu size={22} />}
                    variant="ghost"
                    aria-label="Open menu"
                    onClick={onOpen}
                />
            </div>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton top={4} right={4} />
                    <DrawerBody pt={16} px={5}>
                        <SiteSearch inputId="mobile-site-search" onNavigate={onClose} />
                        <Box as="nav" aria-label="Mobile" mt={6} className="nav-drawer__links">
                            <NavLink to="/courses" className={navLinkClass}>Find a class</NavLink>
                            <NavLink to="/teachers" className={navLinkClass}>Teachers</NavLink>
                            <NavLink to="/institutes" className={navLinkClass}>Institutes</NavLink>
                            {isSignedIn ? (
                                <>
                                    <NavLink to="/student" className={navLinkClass}>My courses</NavLink>
                                    <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                                </>
                            ) : (
                                <a href={INSTITUTE_SIGNUP_URL} className="nav-link">List your institute</a>
                            )}
                        </Box>
                    </DrawerBody>
                    <DrawerFooter flexDirection="column" gap={3} borderTopWidth="1px" borderColor="line">
                        {isSignedIn ? (
                            <>
                                <Text alignSelf="flex-start" color="muted" fontSize="sm">Signed in as {accountLabel}</Text>
                                <Button width="full" variant="outline" onClick={handleLogout}>Log out</Button>
                            </>
                        ) : (
                            <>
                                <Button as={RouterLink} to="/signup" width="full">Sign up</Button>
                                <Button as={RouterLink} to="/login" state={{ from: location.pathname }} width="full" variant="outline">Log in</Button>
                            </>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </header>
    );
};

export default Navbar;
