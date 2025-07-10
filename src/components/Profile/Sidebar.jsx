import { FaSignOutAlt } from "react-icons/fa"; // Keep FaSignOutAlt if you prefer, or replace
import { IoPersonOutline, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5"; // Import new icons

const Sidebar = ({ setActiveSection }) => {
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    // The w-full lg:w-full is controlled by the parent ProfileBody's lg:w-1/4
    // Removed redundant bg-white as parent (ProfileBody) handles its background/blur.
    <div className="w-full flex flex-col justify-between h-full py-4 lg:py-8 space-y-2">
      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2 flex-grow">
        <button
          onClick={() => setActiveSection("profile")}
          className="flex items-center space-x-3 w-full py-3 px-5 text-gray-700 font-medium text-lg rounded-xl
                     hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <IoPersonOutline className="text-xl" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveSection("settings")}
          className="flex items-center space-x-3 w-full py-3 px-5 text-gray-700 font-medium text-lg rounded-xl
                     hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <IoSettingsOutline className="text-xl" />
          <span>Settings</span>
        </button>

        {/* You had a Downloads section in ProfileBody, let's add it here too */}
        <button
          onClick={() => setActiveSection("downloads")}
          className="flex items-center space-x-3 w-full py-3 px-5 text-gray-700 font-medium text-lg rounded-xl
                     hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <IoLogOutOutline className="text-xl transform rotate-90" /> {/* Using IoLogOutOutline for download icon (can be changed) */}
          <span>Downloads</span>
        </button>

      </nav>

      {/* Logout Section */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center space-x-2 w-full py-3 px-5
                   bg-red-500 text-white font-semibold text-lg rounded-xl
                   hover:bg-red-600 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        <IoLogOutOutline className="text-xl" /> {/* Using IoLogOutOutline for consistency */}
        <span>Log Out</span>
      </button>
    </div>
  );
};

export default Sidebar;