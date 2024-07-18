import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`flex w-full justify-center rounded-md bg-primary1 px-3 py-2 text-sm cursor-pointer font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary1 hover:bg-purple-700 ${props.className}`}
    >
      {children}
    </button>
  );
};

export default Button;