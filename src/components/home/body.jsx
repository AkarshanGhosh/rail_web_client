import React from "react";
import { assets } from "../../assets/assets"; // Assuming this path is correct

function Body() {
  return (
    <div className="min-h-screen lg:h-[75vh] flex flex-col-reverse lg:flex-row items-center justify-center px-4 py-16 lg:px-16
                    bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Left Section - Text Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mt-8 lg:mt-0 text-center lg:text-left p-4">
        {/* Modern Heading with Gradient */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight
                       bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700 drop-shadow-md">
          Welcome to Rail Watch
        </h1>

        {/* Concise and Punchy Paragraph Text */}
        <p className="mt-6 text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
          Empowering railway employees with real-time train chain monitoring. Ensure safety and operational integrity with instant updates and comprehensive reports.
        </p>

        {/* Modernized Discover Button */}
        <div className="mt-8">
          <button
            onClick={() => { /* Add navigation or action here, e.g., navigate('/discover') */ }}
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                       font-semibold rounded-full shadow-lg hover:shadow-xl
                       transform hover:scale-105 transition-all duration-300
                       focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
          >
            Discover More
          </button>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <img
          src={assets.train} // Ensure assets.train points to your image
          alt="train"
          className="w-full max-w-sm lg:max-w-lg object-contain rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>
    </div>
  );
}

export default Body;