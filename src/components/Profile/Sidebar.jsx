import { FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ setActiveSection }) => {
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="w-full lg:w-full flex flex-col justify-between">
      {/* Navigation Links */}
      <div className="flex flex-col">
        <div
          onMouseEnter={() => setActiveSection("profile")}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Profile
        </div>
        <div
          onMouseEnter={() => setActiveSection("readLater")}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Read Later
        </div>
        <div
          onMouseEnter={() => setActiveSection("downloads")}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Downloads
        </div>
        {/* Settings Section */}
        <div
          onMouseEnter={() => setActiveSection("settings")}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Settings
        </div>
      </div>

      {/* Logout Section */}
      <div
        onClick={handleLogout}
        className="w-full py-4 px-6 bg-red-600 text-white font-bold text-lg cursor-pointer hover:bg-red-700 hover:text-zinc-300 transition-all duration-300 mt-2"
      >
        Log Out <FaSignOutAlt className="ml-2" />
      </div>
    </div>
  );
};

export default Sidebar;
