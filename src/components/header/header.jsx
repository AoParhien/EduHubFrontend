import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@chakra-ui/react';
import './header.css';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  // Variants for content animation
  const navigate = useNavigate();

  const contentVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        duration: 0.8
      }
    }
  };

  // Variants for image animation
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "tween",
        duration: 0.8,
        delay: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="eduhub__header section__padding" 
      id="home"
      initial="hidden"
      animate="visible"
    >
      <div className="eduhub__header-content">
        <motion.h1 
          variants={contentVariants}
          className="text-4xl font-bold text-dark mb-4"
        >
          Pakistan's #1 MarketPlace for Institutes,
           Book your Seat in a click!
        </motion.h1>
        
        <motion.p 
          variants={contentVariants}
          className="text-lg text-gray-600 mb-6"
        >
          Discover a seamless way to access top-notch online tuition, tailored to your goals. With expert tutors, flexible scheduling, and personalized support, we're here to make your learning journey effortless and effective.
        </motion.p>
        
        <motion.div 
          className="eduhub__header-content__input flex items-center space-x-4"
          variants={contentVariants}
        >
          <Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            bg="brand.500"
            color="white"
            width="100%"
            height="1rem"
            fontFamily="var(--font-family)"
            fontWeight="400"
            fontSize="1.2rem"
            lineHeight="1rem"
            borderColor="transparent"
            borderRadius="var(--eduhub-radius-2xl)"
            _focus={{ outline: 'none' }}
            cursor="pointer"
            className='eduhub__header-register-button'
            onClick={() => navigate('/courses')}
          >
            Browse
          </Button>
          
          <motion.button 
            type="button" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='eduhub__header-learn-more-button '
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>
      
      <motion.div 
        className="eduhub__header-image"
        variants={imageVariants}
      >
        <motion.img 
          src="landing.png" 
          alt='ai'
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Header;
