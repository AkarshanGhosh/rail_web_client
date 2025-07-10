import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Correct Import
import { authActions } from "../../store/auth";
import ForgetPassword from "./ForgetPassword";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"; // Import eye icons

const Login = () => {
  const [values, setValues] = useState({ emailOrPhone: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      if (!values.emailOrPhone || !values.password) {
        displayMessage("Email/Phone and Password are required.", "error");
        return;
      }

      const isEmail = values.emailOrPhone.includes("@");
      const payload = {
        email: isEmail ? values.emailOrPhone : "",
        phone_number: isEmail ? "" : values.emailOrPhone,
        password: values.password,
      };

      console.log("Sending Request Data:", payload);

      const response = await axios.post("https://rail-web-server-r7z1.onrender.com/api/auth/login", payload);

      if (response.data.success) {
        const token = response.data.token;

        if (!token) {
          console.error("No token received from API");
          displayMessage("Login failed: No authentication token received.", "error");
          return;
        }

        // Decode the JWT token to extract role
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const role = decodedToken.role || "user"; // Default to "user" if role is missing
        console.log("User Role Extracted from Token:", role);

        // Store login details in session storage
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);

        // Dispatch login action and update Redux state
        dispatch(authActions.login());
        dispatch(authActions.changeRole(role));

        displayMessage("Login Successful!", "success");

        setTimeout(() => {
          navigate("/"); // Redirect to home page after successful login
        }, 1000);
      } else {
        console.error("Invalid API Response:", response.data);
        displayMessage(response.data.message || "Login failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response?.data) {
        console.error("Full API Response:", error.response.data);
      }

      if (error.response?.data?.message) {
        displayMessage(error.response.data.message, "error");
      } else {
        displayMessage("Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      {!showForgetPassword ? (
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 animate-fade-in-up">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center
                         bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
            Log In
          </h2>
          <form className="space-y-6" onSubmit={submit}>
            {/* Email or Phone Field */}
            <div>
              <label
                htmlFor="emailOrPhone"
                className="block text-gray-700 font-medium mb-2"
              >
                Email or Phone Number
              </label>
              <input
                type="text"
                id="emailOrPhone"
                className="w-full px-4 py-3 text-gray-800 rounded-xl bg-gray-50 border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                placeholder="Enter your email or phone number"
                required
                value={values.emailOrPhone}
                onChange={handleChange}
              />
            </div>

            {/* Password Field with Toggle */}
            <div className="relative"> {/* Added relative positioning for the icon */}
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
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
              Log In
            </button>
          </form>

          {/* Notification Message */}
          {message && (
            <p className={`mt-6 p-3 rounded-lg text-center font-semibold ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}>
              {message}
            </p>
          )}

          {/* Additional Links */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-gray-600">
              Forgot your password?{" "}
              <button
                onClick={() => setShowForgetPassword(true)}
                className="text-indigo-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200"
              >
                Reset Password
              </button>
            </p>
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <a href="/signup" className="text-indigo-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      ) : (
        <ForgetPassword />
      )}
    </div>
  );
};

export default Login;