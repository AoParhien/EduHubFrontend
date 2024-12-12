import React from 'react';
import styled from 'styled-components';
import { FaRegCalendarAlt, FaMapMarkerAlt, FaMoneyBillAlt, FaUserGraduate } from 'react-icons/fa';

const featureCards = [
  {
    id: 'chapter-wise-mcqs',
    title: 'Register from Anywhere, Anytime',
    icon: <FaMapMarkerAlt size={50} color="#F6D33C" />,
    description:
      'Say goodbye to long queues and institute visits. Enjoy seamless online registration from the comfort of your home.'
  },
  {
    id: 'past-paper-flps',
    title: 'Tailored Timetables Just for You',
    icon: <FaRegCalendarAlt size={50} color="#00308F" />,
    description:
      'We craft personalized timetables to ensure your classes are conflict-free and perfectly scheduled.'
  },
  {
    id: 'chapter-wise-shortlistings',
    title: 'One-Stop Institute Marketplace',
    icon: <FaUserGraduate size={50} color="#00308F" />,
    description:
      'Explore a diverse range of institutes and courses, all brought together in one convenient platform.'
  },
  {
    id: 'live-lectures',
    title: 'No Extra Fees, Guaranteed Seats',
    icon: <FaMoneyBillAlt size={50} color="#F6D33C" />,
    description:
      'Book seats without worrying about extra costs. Your seat is secured, and your learning journey is our priority..'
  }
];

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const FeatureCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 12px;
  font-weight: 700;
  color: #00308F;
`;

const FeatureDescription = styled.p`
  font-size: 18px;
  color: #555;
  margin-bottom: 20px;
`;

const LearnMoreButton = styled.a`
  display: inline-block;
  background-color: #00308F;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #00308F;
  }
`;

const SectionHeading = styled.h2`
  font-size: 55px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 40px;
  color: black;
font-family: var(--font-family);
`;

const Features = () => {
  return (
    <div>
      <SectionHeading>What we offer you?</SectionHeading>
      <FeaturesContainer>
        {featureCards.map((feature) => (
          <FeatureCard key={feature.id}>
            {feature.icon}
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesContainer>
    </div>
  );
};

export default Features;