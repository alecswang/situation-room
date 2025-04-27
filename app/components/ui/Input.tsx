import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type UserRole = 'activist' | 'journalist';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  role: UserRole;
}

export default function Input({ className = '', role, ...props }: InputProps) {
  return (
    <input
      className={twMerge(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none',
        role === "activist" 
          ? 'focus:ring-yellow-500 focus:border-yellow-500' 
          : 'focus:ring-blue-900 focus:border-blue-900',
        className
      )}
      {...props}
    />
  );
}