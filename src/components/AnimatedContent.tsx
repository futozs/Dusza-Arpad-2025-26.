'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedContentProps {
  children: React.ReactNode;
  distance?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
}

const AnimatedContent = ({
  children,
  distance = 150,
  direction = 'vertical',
  reverse = false,
  duration = 1.2,
  ease = 'bounce.out',
  initialOpacity = 0.2,
  animateOpacity = true,
  scale = 1.1,
  threshold = 0.2,
  delay = 0.3
}: AnimatedContentProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    margin: '-20% 0px -20% 0px',
    amount: threshold 
  });

  const initialX = direction === 'horizontal' ? (reverse ? distance : -distance) : 0;
  const initialY = direction === 'vertical' ? (reverse ? distance : -distance) : 0;

  return (
    <motion.div
      ref={ref}
      initial={{
        x: initialX,
        y: initialY,
        opacity: initialOpacity,
        scale: scale
      }}
      animate={{
        x: isInView ? 0 : initialX,
        y: isInView ? 0 : initialY,
        opacity: isInView ? 1 : initialOpacity,
        scale: isInView ? 1 : scale
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: ease
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContent;