import { ErrorStateProps } from "../../../types/props";
import React, { FC } from 'react';

export const LoadingState: FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-none">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-[#490b9a] rounded-full animate-spin"></div>
            <p className="mt-4 text-xl font-semibold text-[#490b9a]">Loading...</p>
        </div>
    </div>
);

export const CustomLoading: FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-none">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
            <p className="mt-4 text-xl font-semibold text-white">Loading...</p>
        </div>
    </div>
);

export const ErrorState: FC<ErrorStateProps> = ({ message }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-none">
        <svg className="w-16 h-16 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4">
            {message || "We're having trouble loading the deal information."}
        </p>
        <button onClick={() => window.location.reload()} className="bg-[#490b9a] text-white px-4 py-2 rounded-lg hover:bg-[#490b9ac8] transition duration-300">
            Try Again
        </button>
    </div>
);