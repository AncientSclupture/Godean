import React from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, Home } from "lucide-react";

interface ErrorHappenedProps {
    message?: string;
}

const ErrorHappened: React.FC<ErrorHappenedProps> = ({ message }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
            <h1 className="text-3xl font-bold mb-2">Something Went Wrong</h1>
            <p className="text-gray-600 mb-6">
                {message || "An unexpected error occurred. Please try again."}
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 background-dark text-white font-medium px-4 py-2 rounded-lg shadow"
                >
                    <Home size={18} />
                    Go Home
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg shadow"
                >
                    <RotateCcw size={18} />
                    Refresh
                </button>
            </div>
        </div>
    );
};

export default ErrorHappened