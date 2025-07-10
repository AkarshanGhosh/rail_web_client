import { useState } from "react";
import axios from "axios";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

// Accept an 'isEmbedded' prop
const ForgetPassword = ({ isEmbedded = false }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const displayMessage = (msg, type) => {
    setMessageType(type);
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        "https://rail-web-server-r7z1.onrender.com/api/auth/forgot-password",
        { email }
      );
      if (response.data.success) {
        displayMessage("OTP sent to your email.", "success");
        setStep(2);
      } else {
        displayMessage(response.data.message || "Failed to send OTP.", "error");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      displayMessage("Error sending OTP. Please try again.", "error");
    }
  };

  const handleVerifyOtpAndResetPassword = async () => {
    try {
      const response = await axios.post(
        "https://rail-web-server-r7z1.onrender.com/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      if (response.data.success) {
        displayMessage("Password reset successfully. Redirecting to login...", "success");
        setTimeout(() => {
          // Only redirect if not embedded
          if (!isEmbedded) {
            window.location.href = "/login";
          }
        }, 2000);
      } else {
        displayMessage(response.data.message || "Failed to reset password.", "error");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      displayMessage("Error resetting password. Please try again.", "error");
    }
  };

  // Conditionally apply outer container styles
  const outerContainerClasses = isEmbedded
    ? "" // No outer container styles if embedded
    : "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12";

  // Conditionally apply card styles
  const cardClasses = isEmbedded
    ? "w-full bg-white/90 backdrop-blur-sm p-6 rounded-lg border border-white/20" // Slightly smaller padding for embedded
    : "w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 animate-fade-in-up";

  return (
    <div className={outerContainerClasses}>
      <div className={cardClasses}>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center
                       bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
          {isEmbedded ? "Change Password" : "Reset Password"}
        </h1>

        {/* Notification Message */}
        {message && (
          <p className={`mt-4 mb-6 p-3 rounded-lg text-center font-semibold ${
            messageType === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border-red-200"
          }`}>
            {message}
          </p>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-gray-800 rounded-xl bg-gray-50 border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl
                         hover:shadow-lg transform hover:scale-[1.01] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-2"
              >
                Enter the OTP sent to your email
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-gray-800 rounded-xl bg-gray-50 border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
                placeholder="Enter OTP"
                required
              />
            </div>
            <div className="relative">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Enter your new password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 text-gray-800 rounded-xl bg-gray-50 border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm pr-10"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center pt-8 text-gray-600 hover:text-indigo-600 focus:outline-none"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <IoEyeOffOutline className="h-5 w-5" />
                ) : (
                  <IoEyeOutline className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              onClick={handleVerifyOtpAndResetPassword}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl
                         hover:shadow-lg transform hover:scale-[1.01] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Reset Password
            </button>
          </div>
        )}

        {/* Login Page Link - only show if not embedded */}
        {!isEmbedded && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-indigo-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200"
              >
                Log In
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;