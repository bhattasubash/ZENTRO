import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'nav';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseClasses = "font-bold rounded-lg transition-all active:scale-95";
  
  const variants = {
    primary: "bg-primary-container text-white px-8 py-4 text-base hover:shadow-[0_0_20px_rgba(0,51,255,0.4)]",
    secondary: "bg-surface-container-high text-on-surface px-8 py-4 text-base hover:bg-surface-bright",
    nav: "bg-primary-container text-white px-5 py-2 text-sm hover:shadow-[0_0_15px_rgba(0,51,255,0.3)]"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
