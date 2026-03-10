import React from 'react';
import { motion } from 'framer-motion';

export const RetroCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  animate = true,
  'data-testid': testId,
  ...props 
}) => {
  const variants = {
    default: "bg-surface border-2 border-black shadow-retro",
    game: "bg-black/40 border-4 border-slate-700 backdrop-blur-sm shadow-2xl rounded-xl",
    glow: "bg-surface border-2 border-primary shadow-neon-cyan",
    glass: "bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl",
  };

  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <Component
      className={`p-4 md:p-6 relative overflow-hidden ${variants[variant]} ${className}`}
      data-testid={testId}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default RetroCard;
