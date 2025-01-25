import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpBody = () => {
  const [values, setValues] = useState({
    username: "", // Updated field name to "username"
    email: "",
    phone_number: "", // Updated field name to "phone_number"
    password: "",
  });
  const [message, setMessage] = useState(""); // To display notifications
  const [messageType, setMessageType] = useState(""); // success or error
  const navigate = useNavigate();

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
        setMessageType("error");
        setMessage("All fields are required.");
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
      const response = await axios.post("https://rail-web-server.onrender.com/api/auth/register", payload);

      if (response.data.success) {
        setMessageType("success");
        setMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      } else {
        setMessageType("error");
        setMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        setMessageType("error");
        setMessage(error.response.data.message || "Registration failed.");
      } else {
        console.error("Error:", error);
        setMessageType("error");
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="h-auto lg:h-[75vh] flex flex-col-reverse lg:flex-row items-center lg:items-center px-4 lg:px-16 bg-gray-100">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mt-8 lg:mt-0">
        <p className="mt-4 text-lg lg:text-xl text-gray-600 text-center lg:text-left">
          Sign up here if you do not have an account.
        </p>
      </div>

      {/* Right Section (Sign-Up Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Create Your Account
          </h2>
          <form className="space-y-4" onSubmit={submit}>
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 text-gray-800 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring focus:ring-green-400"
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
                className="w-full px-4 py-2 text-gray-800 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring focus:ring-green-400"
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
                type="text"
                id="phone_number"
                className="w-full px-4 py-2 text-gray-800 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring focus:ring-green-400"
                placeholder="Enter your phone number"
                required
                value={values.phone_number}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 text-gray-800 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring focus:ring-green-400"
                placeholder="Enter your password"
                required
                value={values.password}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Notification Message */}
          {message && (
            <p
              className={`mt-4 text-center font-semibold ${
                messageType === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-green-500 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpBody;
