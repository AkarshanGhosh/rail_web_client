import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode"; // ✅ Correct Import
import { authActions } from "../../store/auth";
import ForgetPassword from "./ForgetPassword";

const Login = () => {
  const [values, setValues] = useState({ emailOrPhone: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        setMessageType("error");
        setMessage("Email/Phone and Password are required.");
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
          return;
        }

        // ✅ Decode the JWT token to extract role
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const role = decodedToken.role || "user"; // Default to "user" if role is missing
        console.log("User Role Extracted from Token:", role);

        // ✅ Store login details in session storage
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role); // ✅ Store role

        // ✅ Dispatch login action and update Redux state
        dispatch(authActions.login());
        dispatch(authActions.changeRole(role)); // ✅ Update Redux with role

        setMessageType("success");
        setMessage("Login Successful!");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        console.error("Invalid API Response:", response.data);
        setMessageType("error");
        setMessage(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response?.data) {
        console.error("Full API Response:", error.response.data);
      }

      if (error.response?.data?.message) {
        setMessageType("error");
        setMessage(error.response.data.message);
      } else {
        setMessageType("error");
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      {!showForgetPassword ? (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
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
                className="w-full px-4 py-2 text-gray-800 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring focus:ring-green-400"
                placeholder="Enter your email or phone number"
                required
                value={values.emailOrPhone}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
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
              Log In
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

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Forgot your password?{" "}
              <button
                onClick={() => setShowForgetPassword(true)}
                className="text-green-500 hover:underline"
              >
                Reset Password
              </button>
            </p>
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <a href="/signup" className="text-green-500 hover:underline">
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
