import React from 'react';
import { motion } from 'framer-motion';

export const RetroButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  'data-testid': testId,
  ...props 
}) => {
  const baseStyles = "font-pixel uppercase tracking-wider border-b-4 border-r-4 border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-black hover:brightness-110",
    secondary: "bg-secondary text-white hover:brightness-110",
    accent: "bg-accent text-black hover:brightness-110",
    success: "bg-success text-white hover:brightness-110",
    error: "bg-error text-white hover:brightness-110",
    ghost: "bg-transparent text-primary border-2 border-primary hover:bg-primary/10",
  };

  const sizes = {
    sm: "text-[8px] md:text-[10px] py-2 px-4",
    md: "text-[10px] md:text-xs py-3 px-6",
    lg: "text-xs md:text-sm py-4 px-8",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95, y: 2 }}
      data-testid={testId}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default RetroButton;
