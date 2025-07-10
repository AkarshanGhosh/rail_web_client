import React from "react";
import { IoMailOutline, IoSendOutline, IoCloseOutline } from "react-icons/io5";

const SendEmailModal = ({
  emailData,
  setEmailData,
  sendEmail,
  setShowEmailModal,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <IoMailOutline className="mr-2 text-indigo-500" />
            Send Email
          </h3>
          <button
            onClick={() => setShowEmailModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoCloseOutline className="text-xl text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Recipient Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send to:
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recipientType"
                  value="all"
                  checked={emailData.recipientType === "all"}
                  onChange={(e) =>
                    setEmailData({
                      ...emailData,
                      recipientType: e.target.value,
                      email: "",
                    })
                  }
                  className="mr-2"
                />
                All Users
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recipientType"
                  value="specific"
                  checked={emailData.recipientType === "specific"}
                  onChange={(e) =>
                    setEmailData({
                      ...emailData,
                      recipientType: e.target.value,
                    })
                  }
                  className="mr-2"
                />
                Specific User
              </label>
            </div>
          </div>

          {/* Email Field */}
          {emailData.recipientType === "specific" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email:
              </label>
              <input
                type="email"
                value={emailData.email}
                onChange={(e) =>
                  setEmailData({ ...emailData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                placeholder="Enter recipient's email address"
              />
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject:
            </label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData({ ...emailData, subject: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="Enter email subject"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message:
            </label>
            <textarea
              value={emailData.message}
              onChange={(e) =>
                setEmailData({ ...emailData, message: e.target.value })
              }
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              placeholder="Enter your message here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setShowEmailModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={sendEmail}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
            >
              <IoSendOutline className="text-lg" />
              <span>Send Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal;
