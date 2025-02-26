import { FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ setActiveSection }) => {
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="w-full lg:w-full flex flex-col justify-between bg-white">
      {/* Navigation Links */}
      <div className="flex flex-col">
        <div
          onMouseEnter={() => setActiveSection("profile")}
          className="w-full py-4 px-6 text-black font-bold text-lg cursor-pointer hover:bg-gray-300 hover:text-blue-600 transition-all duration-300"
        >
          Profile
        </div>
        {/* Settings Section */}
        <div
          onMouseEnter={() => setActiveSection("settings")}
          className="w-full py-4 px-6 text-black font-bold text-lg cursor-pointer hover:bg-gray-300 hover:text-blue-600 transition-all duration-300"
        >
          Settings
        </div>
      </div>

      {/* Logout Section */}
      <div
        onClick={handleLogout}
        className="w-full py-4 px-6 bg-red-500 text-white font-bold text-lg cursor-pointer hover:bg-red-700 hover:text-gray-100 transition-all duration-300 mt-2"
      >
        Log Out <FaSignOutAlt className="ml-2" />
      </div>
    </div>
  );
};

export default Sidebar;
