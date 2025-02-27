import { useState } from "react";
import ForgetPassword from "../Login and signUP/ForgetPassword"; // Adjusted import path

const Settings = () => {
  const [showChangePassword, setShowChangePassword] = useState(false); // Toggle for ForgetPassword component

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-gray-100 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Settings</h1>

        {/* Update Name Placeholder */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Update Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your new name"
            className="w-full border border-gray-400 rounded-lg p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            className="w-full mt-3 bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
            disabled
          >
            Update Name (Feature Coming Soon)
          </button>
        </div>

        {/* Change Password */}
        <div className="mb-6">
          {!showChangePassword ? (
            <>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Change Password
              </label>
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                Change Password
              </button>
            </>
          ) : (
            <ForgetPassword />
          )}
        </div>

        {/* Update Profile Image Placeholder */}
        <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Update Profile Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="w-full border border-gray-400 rounded-lg p-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled
          />
          <button
            className="w-full mt-3 bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
            disabled
          >
            Update Image (Feature Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
