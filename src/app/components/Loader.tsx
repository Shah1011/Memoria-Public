import React from 'react';

interface LoaderProps {
    width?: string;  // Optional prop for width
    height?: string; // Optional prop for height
}

const Loader: React.FC<LoaderProps> = ({ width = '24px', height = '24px' }) => {
    return (
        <div
            className={`border-[3px] border-t-violet-600 border-gray-300 rounded-full animate-spin`}
            style={{ width, height }}
        ></div>
    );
};

export default Loader;