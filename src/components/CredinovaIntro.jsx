import React from 'react';
import BlurText from './BlurText';
import Hyperspeed from './Hyperspeed';
import './CredinovaIntro.css';

export default function CredinovaIntro() {
  return (
    <div className="credinova-intro-screen" aria-label="CrediNova intro">
      {/* Hyperspeed warp animation fills the entire background */}
      <Hyperspeed />

      {/* CrediNova brand name, centered above the animation */}
      <div className="credinova-intro-content">
        <BlurText
          text="CrediNova"
          delay={120}
          animateBy="letters"
          direction="top"
          stepDuration={0.35}
          className="credinova-intro-brand"
        />
      </div>
    </div>
  );
}
