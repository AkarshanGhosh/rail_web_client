import React from "react";
// Import social media icons from react-icons/io5
import {
  IoLogoGithub,
  IoLogoLinkedin,
  IoLogoTwitter
} from "react-icons/io5";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-300 px-4 py-8 w-full shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">

        {/* Copyright Information */}
        <p className="text-sm font-light text-center md:text-left">
          &copy; {new Date().getFullYear()} Akarshan Ghosh. All Rights Reserved.
        </p>

        {/* Social Media Links */}
        <div className="flex items-center space-x-6">
          {/* GitHub Link */}
          <a
            href="https://github.com/AkarshanGhosh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
          >
            <IoLogoGithub className="text-2xl" />
          </a>

          {/* LinkedIn Link */}
          <a
            href="https://www.linkedin.com/in/akarshan-ghosh/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
          >
            <IoLogoLinkedin className="text-2xl" />
          </a>

          {/* Twitter (X) Link */}
          <a
            href="https://x.com/AkarshanGhosh28"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
            className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110"
          >
            <IoLogoTwitter className="text-2xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;