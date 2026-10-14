import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { BOARDS } from '../../utils/format';
import './header.css';

const HERO_BOARDS = BOARDS.slice(0, 4);

const Header = () => (
    <section className="hero page" aria-labelledby="hero-title">
        <div className="hero__content">
            <h1 id="hero-title">Find the right institute and book your seat online</h1>
            <p className="hero__lead">
                Compare tuition classes from institutes across Pakistan. See each batch's
                timetable and monthly fee, reserve your seat in a few clicks, and pay the
                institute on your first day.
            </p>

            <div className="hero__actions">
                <Button as={RouterLink} to="/courses" size="lg" px={8}>
                    Browse courses
                </Button>
                <Button as="a" href="#how-it-works" size="lg" variant="outline" px={8}>
                    How it works
                </Button>
            </div>

            <div className="hero__boards">
                <p id="hero-boards-label">Studying for</p>
                <ul aria-labelledby="hero-boards-label">
                    {HERO_BOARDS.map((board) => (
                        <li key={board.slug}>
                            <RouterLink to={`/courses/${board.slug}`}>{board.label}</RouterLink>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
            <div className="hero__panel">
                <img src="/landing.png" alt="" />
            </div>
        </div>
    </section>
);

export default Header;
