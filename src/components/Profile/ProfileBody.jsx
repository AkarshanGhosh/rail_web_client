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

        const response = await axios.get("https://rail-web-server.onrender.com/api/user/data", {
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
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-6">
              Welcome, {userData?.username}
            </h1>
            <div className="flex flex-col lg:flex-row items-center mb-8">
              <img
                src={userData?.avatar || "https://via.placeholder.com/150"}
                alt="User Avatar"
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full mb-4 lg:mb-0 lg:mr-6"
              />
              <div className="text-center lg:text-left">
                <p className="text-xl lg:text-2xl font-semibold text-black">
                  {userData?.username}
                </p>
                <p className="text-md lg:text-lg text-gray-600">
                  Email: {userData?.email}
                </p>
                <p className="text-md lg:text-lg text-gray-600">
                  Phone: {userData?.phone_number}
                </p>
                <p className="text-md lg:text-lg text-gray-600">
                  Role: {userData?.role}
                </p>
                <p className="text-md lg:text-lg text-gray-600">
                  Created At: {new Date(userData?.createdAt).toLocaleString()}
                </p>
                <p className="text-md lg:text-lg text-gray-600">
                  Updated At: {new Date(userData?.updatedAt).toLocaleString()}
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
          <div className="text-lg text-gray-600">
            Select an option from the sidebar to view details.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-red-600">
        Failed to load user data. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white text-black">
      {/* Sidebar */}
      <div
        className="w-full lg:w-1/4 bg-gray-200 p-4 flex flex-col h-screen"
        style={{ transition: "all 0.3s ease" }}
      >
        <Sidebar setActiveSection={setActiveSection} />
      </div>

      {/* Main Content */}
      <div
        className="w-full lg:w-3/4 p-4 lg:p-8 overflow-auto"
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
