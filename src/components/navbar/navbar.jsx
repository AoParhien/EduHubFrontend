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
import { formatBoard } from '../../utils/format';
import './navbar.css';

const INSTITUTE_SIGNUP_URL =
    process.env.REACT_APP_INSTITUTE_SIGNUP_URL ||
    process.env.VITE_INSTITUTE_SIGNUP_URL ||
    'mailto:aoparhien@gmail.com?subject=List%20my%20institute%20on%20AoParhein';

const CourseSearch = ({ onNavigate, autoFocus = false }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const runSearch = useMemo(
        () =>
            debounce(async (value) => {
                try {
                    const response = await axios.get(`${BACKEND_URL}/api/courses/search`, {
                        params: { title: value },
                    });
                    setResults(response.data.courses || []);
                } catch (error) {
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            }, 300),
        []
    );

    useEffect(() => () => runSearch.cancel(), [runSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        setQuery(value);

        if (!value.trim()) {
            runSearch.cancel();
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }

        setIsOpen(true);
        setIsLoading(true);
        runSearch(value.trim());
    };

    const goToCourse = useCallback((courseId) => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        navigate(`/course-details/${courseId}`);
        onNavigate?.();
    }, [navigate, onNavigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (results[0]) {
            goToCourse(results[0]._id);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="nav-search" ref={containerRef}>
            <form role="search" onSubmit={handleSubmit}>
                <label htmlFor={autoFocus ? 'mobile-course-search' : 'course-search'} className="visually-hidden">
                    Search courses
                </label>
                <FiSearch className="nav-search__icon" aria-hidden="true" />
                <input
                    id={autoFocus ? 'mobile-course-search' : 'course-search'}
                    type="search"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search courses, e.g. O Level Maths"
                    autoComplete="off"
                />
            </form>

            {isOpen && (
                <div className="nav-search__results" role="listbox" aria-label="Matching courses">
                    {isLoading ? (
                        <p className="nav-search__status">Searching…</p>
                    ) : results.length > 0 ? (
                        results.slice(0, 8).map((course) => (
                            <button
                                type="button"
                                role="option"
                                aria-selected="false"
                                key={course._id}
                                className="nav-search__result"
                                onClick={() => goToCourse(course._id)}
                            >
                                <span className="nav-search__result-title">{course.title}</span>
                                <span className="nav-search__result-meta">
                                    {[formatBoard(course.board), course.subject].filter(Boolean).join(', ')}
                                </span>
                            </button>
                        ))
                    ) : (
                        <p className="nav-search__status">No courses match "{query}". Try a subject such as Physics.</p>
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
                    <CourseSearch />
                </div>

                <nav className="nav__links" aria-label="Main">
                    <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
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
                        <CourseSearch autoFocus onNavigate={onClose} />
                        <Box as="nav" aria-label="Mobile" mt={6} className="nav-drawer__links">
                            <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
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
