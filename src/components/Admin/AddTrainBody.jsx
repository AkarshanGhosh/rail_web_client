import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5"; // Back Icon

const AddTrainBody = () => {
  const navigate = useNavigate();
  const [trainData, setTrainData] = useState({
    division: "",
    states: "",
    cities: "",
    train_Name: "",
    train_Number: "",
  });
  const [message, setMessage] = useState("");

  // Retrieve token from sessionStorage
  const token = sessionStorage.getItem("token");

  // Division Options
  const divisions = ["NFR", "ER", "WR", "SER", "SR", "NWR"];

  // Handle input changes
  const handleChange = (e) => {
    setTrainData({ ...trainData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Sends API request)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!trainData.division || !trainData.states || !trainData.cities || !trainData.train_Name || !trainData.train_Number) {
      setMessage("⚠️ All fields are required!");
      return;
    }

    // Check if token is available before making the request
    if (!token) {
      setMessage("⚠️ Authentication failed! Please log in again.");
      return;
    }

    // Prepare JSON payload
    const payload = {
      division: trainData.division,
      states: trainData.states,
      cities: trainData.cities,
      train_Name: trainData.train_Name,
      train_Number: trainData.train_Number,
    };

    console.log("📤 Sending Payload:", JSON.stringify(payload)); // Debugging Log

    try {
      const response = await axios.post(
        "https://rail-web-server.onrender.com/api/division/add-division",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🚂 Train Added Successfully:", response.data);
      setMessage("✅ Train added successfully!");

      // Redirect back to Admin Dashboard after a delay
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
    } catch (error) {
      console.error("🚨 Error Adding Train:", error);

      if (error.response) {
        console.log("🛑 API Response Data:", error.response.data);
        console.log("🛑 API Response Status:", error.response.status);
        console.log("🛑 API Response Headers:", error.response.headers);
        setMessage(`❌ ${error.response.data.message || "Failed to add train. Try again."}`);
      } else if (error.request) {
        console.log("🛑 No Response Received:", error.request);
        setMessage("❌ No response from the server. Please try again.");
      } else {
        console.log("🛑 Error Details:", error.message);
        setMessage("❌ Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6">
      {/* Back Button */}
      <div className="w-full max-w-2xl flex items-center mb-4">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center text-gray-700 hover:text-gray-900 text-lg font-semibold"
        >
          <IoArrowBack className="mr-2" size={24} /> Back to Admin Dashboard
        </button>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Train</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Division Dropdown */}
          <select
            name="division"
            value={trainData.division}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          >
            <option value="" disabled>Select Division</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="states"
            placeholder="State"
            value={trainData.states}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="cities"
            placeholder="City"
            value={trainData.cities}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="train_Name"
            placeholder="Train Name"
            value={trainData.train_Name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <input
            type="text"
            name="train_Number"
            placeholder="Train Number"
            value={trainData.train_Number}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition duration-300"
          >
            Submit
          </button>
        </form>

        {/* Success/Error Message */}
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default AddTrainBody;
