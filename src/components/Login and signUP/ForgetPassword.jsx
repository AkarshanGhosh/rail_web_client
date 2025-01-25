import { useState } from "react";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState(""); // To store the email
  const [otp, setOtp] = useState(""); // To store the OTP
  const [newPassword, setNewPassword] = useState(""); // To store the new password
  const [step, setStep] = useState(1); // To track the current step
  const [message, setMessage] = useState(""); // To display messages

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "https://rail-web-server.onrender.com/api/auth/forgot-password",
        { email }
      );
      if (response.data.success) {
        setMessage("OTP sent to your email.");
        setStep(2); // Move to the OTP verification step
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtpAndResetPassword = async () => {
    try {
      const response = await axios.post(
        "https://rail-web-server.onrender.com/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      if (response.data.success) {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login page
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Reset Password
        </h1>
        {message && (
          <p className="text-center mb-4 text-sm font-medium text-red-500">
            {message}
          </p>
        )}
        {step === 1 && (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
              placeholder="Enter your email"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all"
            >
              Send OTP
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Enter the OTP sent to your email
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
              placeholder="Enter OTP"
            />
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium mb-2 text-gray-700"
            >
              Enter your new password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
              placeholder="Enter new password"
            />
            <button
              onClick={handleVerifyOtpAndResetPassword}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all"
            >
              Reset Password
            </button>
          </div>
        )}

        {/* Login Page Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-green-500 font-medium hover:underline"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
