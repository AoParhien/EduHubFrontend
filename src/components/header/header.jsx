import React from 'react';
import { Button } from '@chakra-ui/react';
import './header.css';

const Header = () => (
    <div className="eduhub__header section__padding" id="home">
        <div className="eduhub__header-content">
            <h1>
            Streamlining your <span class="registration-text">registration</span>, making education accessible.
            </h1>

            <p>Discover a seamless way to access top-notch online tuition, tailored to your goals. With expert tutors, flexible scheduling, and personalized support, we’re here to make your learning journey effortless and effective.</p>

            <div className="eduhub__header-content__input">
            <Button
                bg="#00308F"
                color="white"
                width="25%"
                height="50px"
                fontFamily="var(--font-family)"
                fontWeight="400"
                fontSize="25px"
                lineHeight="26px"
                borderColor="transparent"
                borderRadius="39px"
                marginRight="2rem"
                padding="25px"
            
                _focus={{ outline: 'none' }} // Removes the default outline on focus
                cursor="pointer"
                className='eduhub__header-register-button'
                >
                Register
                </Button>
                <button type="button" className='eduhub__header-learn-more-button'>Learn More</button>
            </div>
            {/* 
            <div className="eduhub__header-content__people">
                <img src={people} alt='people' />
                <p>1,600 people requested access a visit in last 24 hours</p>
            </div> */}
        </div>

        <div className="eduhub__header-image">
            <img src="landing.png" alt='ai' />
        </div>
    </div>
);

export default Header;