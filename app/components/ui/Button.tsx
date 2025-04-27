import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outlineblue' | 'outlineyellow' | 'outlineblackyellow' | 'outlineblackblue' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-yellow-500 hover:bg-yellow-600 text-black',
    secondary: 'bg-blue-900 hover:bg-blue-800 text-white',
    outlineblue: 'border border-blue-900 text-blue-900 hover:bg-blue-50',
    outlineyellow: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-60',
    outlineblackyellow: 'border border-black-500 text-black-500 hover:bg-yellow-500',
    outlineblackblue: 'border border-black-500 text-black-500 hover:bg-blue-900 hover:text-white',
    ghost: 'bg-transparent hover:bg-opacity-10 hover:bg-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}