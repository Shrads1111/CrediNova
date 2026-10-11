import React from 'react';

export interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, any>;
  animationTo?: Array<Record<string, any>>;
  easing?: (t: number) => number | string;
  onAnimationComplete?: () => void;
  stepDuration?: number;
}

declare const BlurText: React.FC<BlurTextProps>;
export default BlurText;
