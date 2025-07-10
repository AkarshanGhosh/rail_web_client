import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Settings from "./settings"; // Import Settings component
import UnderConstruction from "../UnderConstruction";

const ProfileBody = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState("profile"); // Set "profile" as the default active section

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError(true);
          return;
        }

        const response = await axios.get("https://rail-web-server-r7z1.onrender.com/api/user/data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          // Profile Content Card
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 animate-fade-in-up">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8
                           bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              Welcome, {userData?.username}!
            </h1>
            <div className="flex flex-col lg:flex-row items-center lg:items-start mb-8">
              <img
                src={userData?.avatar || "https://via.placeholder.com/150"}
                alt="User Avatar"
                className="w-28 h-28 lg:w-40 lg:h-40 rounded-full object-cover mb-6 lg:mb-0 lg:mr-8
                           border-4 border-indigo-300 shadow-lg transition-transform duration-300 hover:scale-105"
              />
              <div className="text-center lg:text-left space-y-3">
                <p className="text-xl lg:text-2xl font-semibold text-gray-900">
                  <span className="font-bold text-indigo-700">Username:</span> {userData?.username}
                </p>
                <p className="text-md lg:text-lg text-gray-700">
                  <span className="font-bold text-indigo-700">Email:</span> {userData?.email}
                </p>
                <p className="text-md lg:text-lg text-gray-700">
                  <span className="font-bold text-indigo-700">Phone:</span> {userData?.phone_number}
                </p>
                <p className="text-md lg:text-lg text-gray-700">
                  <span className="font-bold text-indigo-700">Role:</span> {userData?.role}
                </p>
                <p className="text-md lg:text-lg text-gray-700">
                  <span className="font-bold text-indigo-700">Created At:</span> {new Date(userData?.createdAt).toLocaleString()}
                </p>
                <p className="text-md lg:text-lg text-gray-700">
                  <span className="font-bold text-indigo-700">Updated At:</span> {new Date(userData?.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      case "downloads":
        return <UnderConstruction />; // Render UnderConstruction for Downloads
      case "settings":
        return <Settings />; // Render Settings component
      default:
        return (
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 flex items-center justify-center h-full">
            <p className="text-xl text-gray-700 font-medium text-center">
              Select an option from the sidebar to view details.
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-xl font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 text-red-700">
        <div className="text-center p-8 rounded-xl bg-white/90 backdrop-blur-sm shadow-xl border border-red-200">
          <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
          <p className="text-lg">Failed to load user data. Please ensure you are logged in and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900">
      {/* Sidebar */}
      <div
        className="w-full lg:w-1/4 bg-white/70 backdrop-blur-md p-6 flex flex-col h-auto lg:h-screen
                   lg:rounded-r-2xl shadow-xl lg:border-r border-white/20"
        style={{ transition: "all 0.3s ease" }}
      >
        <Sidebar setActiveSection={setActiveSection} />
      </div>

      {/* Main Content */}
      <div
        className="flex-1 p-4 lg:p-8 overflow-auto flex items-center justify-center" // Added flex items-center justify-center for default content
        style={{
          transition: "all 0.3s ease",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileBody;