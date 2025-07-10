import React from "react";

const UnderConstruction = () => {
  return (
    // This outer div now acts as the styled content card
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 animate-fade-in-up h-full flex items-center justify-center w-full">
      <div className="text-center max-w-lg"> {/* Inner div to control content width and text alignment */}
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4
                       bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
          Page Under Construction
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          We're working hard to bring you a better experience. Please check back soon!
        </p>
        <div className="flex justify-center mb-6 overflow-hidden rounded-xl shadow-lg border border-gray-300">
          {/* Using the specific GIF provided by the user */}
          <iframe
            src="https://giphy.com/embed/l0K4aAjMMROnB6AOk" // Embed URL for the provided GIF
            width="100%"
            height="100%"
            className="w-full h-auto max-w-sm md:max-w-lg" // Adjust size as needed
            frameBorder="0"
            allowFullScreen
            title="Train Under Construction GIF"
          ></iframe>
        </div>
        <p className="text-gray-700"> {/* Ensuring link text color is consistent */}
          <a
            href="https://giphy.com/gifs/l0K4aAjMMROnB6AOk" // Link to the Giphy page for the provided GIF
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
          >
            View this GIF on Giphy
          </a>
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;