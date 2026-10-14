import React from 'react';
import './Features.css';

const steps = [
  {
    title: 'Choose your board and subject',
    description: 'Browse O Level, A Level, Matric and Intermediate classes from institutes on AoParhein, all in one place.',
  },
  {
    title: 'Compare timetables and fees',
    description: 'Each course shows its batches, weekly class times, teacher, location and the full fee breakdown.',
  },
  {
    title: 'Reserve your seat online',
    description: 'Pick the batch that fits your week and confirm. No queues at the institute and no booking charges.',
  },
  {
    title: 'Pay at the institute',
    description: 'Pay the registration and first month’s fee to the institute on your first day of class.',
  },
];

const Features = () => (
  <section id="how-it-works" className="how-it-works" aria-labelledby="how-it-works-title">
    <div className="page page-section">
      <div className="section-heading">
        <h2 id="how-it-works-title">How booking works</h2>
        <p>From finding a class to sitting in it, in four steps.</p>
      </div>
      <ol className="how-it-works__steps">
        {steps.map((step, index) => (
          <li key={step.title} className="how-it-works__step">
            <span className="how-it-works__number" aria-hidden="true">{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Features;
