import React from 'react';
import ai from '../../assets/ai.png';
import { Button } from '@chakra-ui/react';
import './header.css';

const Header = () => (
    <div className="eduhub__header section__padding" id="home">
        <div className="eduhub__header-content">
            <h1 className="gradient__text">
                Your <span className="highlighted-text !important">Classroom</span><br /> Awaits
            </h1>

            <p>Yet bed any for travelling assistance indulgence unpleasing. Not thoughts all exercise blessing. Indulgence way everything joy alteration boisterous the attachment. Party we years to order allow asked of.</p>

            <div className="eduhub__header-content__input">
            <Button
                bg="purple.600"
                color="white"
                width="25%"
                height="40px"
                fontFamily="var(--font-family)"
                fontWeight="400"
                fontSize="16px"
                lineHeight="26px"
                borderColor="transparent"
                borderRadius="39px"
                marginRight="2rem"
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
            <img src={ai} alt='ai' />
        </div>
    </div>
);

export default Header;