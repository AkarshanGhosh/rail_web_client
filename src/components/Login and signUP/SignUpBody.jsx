import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // Import eye icons

const SignUpBody = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [message, setMessage] = useState(""); // To display notifications
  const [messageType, setMessageType] = useState(""); // success or error
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const navigate = useNavigate();

  // Helper to set message and clear it after a delay
  const displayMessage = (msg, type) => {
    setMessageType(type);
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000); // Clear message after 5 seconds
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      // Validate all fields
      if (!values.username || !values.email || !values.password || !values.phone_number) {
        displayMessage("All fields are required.", "error");
        return;
      }

      // Payload to match the backend JSON structure
      const payload = {
        username: values.username,
        email: values.email,
        phone_number: values.phone_number,
        password: values.password,
      };

      console.log("Request Payload:", payload); // Log the payload for debugging

      // Make API call
      const response = await axios.post("https://rail-web-server-r7z1.onrender.com/api/auth/register", payload);

      if (response.data.success) {
        displayMessage("Account created successfully! Redirecting to login...", "success");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      } else {
        displayMessage(response.data.message || "Registration failed.", "error");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        displayMessage(error.response.data.message || "Registration failed.", "error");
      } else {
        console.error("Error:", error);
        displayMessage("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    // Main Container: Modern gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      {/* Sign-Up Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center
                       bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
          Create Your Account
        </h2>
        {/* Introductory text moved inside the card */}
        <p className="mb-8 text-lg text-gray-700 text-center leading-relaxed">
          Sign up here to get started with Rail Watch and monitor train chain status.
        </p>

        <form className="space-y-6" onSubmit={submit}>
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 text-gray-800 rounded-xl bg-gray-50 border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="Enter your username"
              required
              value={values.username}
              onChange={handleChange}
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 text-gray-800 rounded-xl bg-gray-50 border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="Enter your email"
              required
              value={values.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label htmlFor="phone_number" className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text" // Use "tel" for better mobile keyboard, but "text" is fine for general
              id="phone_number"
              className="w-full px-4 py-3 text-gray-800 rounded-xl bg-gray-50 border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
              placeholder="Enter your phone number"
              required
              value={values.phone_number}
              onChange={handleChange}
            />
          </div>

          {/* Password Field with Toggle */}
          <div className="relative"> {/* Added relative positioning for the icon */}
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            {/* Toggle type based on state */}
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-3 text-gray-800 rounded-xl bg-gray-50 border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm pr-10" // Added pr-10 for icon space
              placeholder="Enter your password"
              required
              value={values.password}
              onChange={handleChange}
            />
            <button
              type="button" // Important: Prevent form submission
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center pt-8 text-gray-600 hover:text-indigo-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <IoEyeOffOutline className="h-5 w-5" />
              ) : (
                <IoEyeOutline className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl
                       hover:shadow-lg transform hover:scale-[1.01] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Sign Up
          </button>
        </form>

        {/* Notification Message */}
        {message && (
          <p className={`mt-6 p-3 rounded-lg text-center font-semibold ${
            messageType === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {message}
          </p>
        )}

        {/* Login Link */}
        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpBody;