import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack, IoTrainOutline, IoLocationOutline, IoBusinessOutline, IoTicketOutline } from "react-icons/io5";

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
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve token from sessionStorage
  const token = sessionStorage.getItem("token");

  // Division Options
  const divisions = ["NFR", "ER", "WR", "SER", "SR", "NWR"];

  // Handle input changes
  const handleChange = (e) => {
    setTrainData({ ...trainData, [e.target.name]: e.target.value });
    // Clear message when user starts typing
    if (message) setMessage("");
  };

  // Handle form submission (Sends API request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    if (!trainData.division || !trainData.states || !trainData.cities || !trainData.train_Name || !trainData.train_Number) {
      setMessage("⚠️ All fields are required!");
      setIsLoading(false);
      return;
    }

    // Check if token is available before making the request
    if (!token) {
      setMessage("⚠️ Authentication failed! Please log in again.");
      setIsLoading(false);
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
        "https://rail-web-server-r7z1.onrender.com/api/division/add-division",
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

      // Clear form
      setTrainData({
        division: "",
        states: "",
        cities: "",
        train_Name: "",
        train_Number: "",
      });

      // Redirect back to Admin Dashboard after a delay
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="group flex items-center text-gray-600 hover:text-indigo-600 text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            <IoArrowBack className="mr-2 transition-transform duration-200 group-hover:-translate-x-1" size={24} />
            Back to Admin Dashboard
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
              <IoTrainOutline className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Train</h1>
            <p className="text-gray-600">Fill in the details to add a new train to the system</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Division Dropdown */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <IoBusinessOutline className="mr-2 text-indigo-500" />
                  Division
                </label>
                <div className="relative">
                  <select
                    name="division"
                    value={trainData.division}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 appearance-none cursor-pointer hover:border-gray-300"
                    required
                  >
                    <option value="" disabled>Select Division</option>
                    {divisions.map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* State Input */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <IoLocationOutline className="mr-2 text-indigo-500" />
                  State
                </label>
                <input
                  type="text"
                  name="states"
                  placeholder="Enter state name"
                  value={trainData.states}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                  required
                />
              </div>

              {/* City Input */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <IoLocationOutline className="mr-2 text-indigo-500" />
                  City
                </label>
                <input
                  type="text"
                  name="cities"
                  placeholder="Enter city name"
                  value={trainData.cities}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                  required
                />
              </div>

              {/* Train Name Input */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <IoTrainOutline className="mr-2 text-indigo-500" />
                  Train Name
                </label>
                <input
                  type="text"
                  name="train_Name"
                  placeholder="Enter train name"
                  value={trainData.train_Name}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Train Number Input - Full Width */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <IoTicketOutline className="mr-2 text-indigo-500" />
                Train Number
              </label>
              <input
                type="text"
                name="train_Number"
                placeholder="Enter train number"
                value={trainData.train_Number}
                onChange={handleChange}
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 placeholder-gray-400 hover:border-gray-300"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Adding Train...</span>
                  </>
                ) : (
                  <>
                    <IoTrainOutline className="text-xl" />
                    <span>Add Train</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Success/Error Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center font-medium ${
              message.includes("✅") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Important Notes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ensure all information is accurate before submitting</li>
                <li>• Train numbers should be unique across the system</li>
                <li>• Division codes: NFR, ER, WR, SER, SR, NWR</li>
                <li>• Contact support if you encounter any issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTrainBody;