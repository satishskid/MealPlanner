
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Analyzing your nutrition...", 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col justify-center items-center my-8 space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-gray-200`}></div>
        {/* Inner spinning part */}
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-transparent border-t-green-500 border-r-green-500 absolute top-0 left-0`}></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      
      {message && (
        <div className="text-center">
          <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
            {message}
          </p>
          <div className="flex space-x-1 justify-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
