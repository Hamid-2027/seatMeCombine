import React from 'react';

interface FullScreenLoaderProps {
  message?: string;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ message = 'Processing...' }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-6 text-lg font-semibold text-gray-800 tracking-wide">{message}</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
