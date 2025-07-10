import React, { useState } from "react";
import { IoMailOutline, IoCallOutline, IoLocationOutline, IoSendOutline } from "react-icons/io5";
import { IoLogoGithub, IoLogoLinkedin, IoLogoTwitter } from "react-icons/io5"; // Social icons

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend API.
    // For now, we'll simulate a success/error message.

    console.log("Form Data Submitted:", formData);

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setMessageType("error");
      setStatusMessage("Please fill in all fields.");
      setTimeout(() => { setStatusMessage(""); setMessageType(""); }, 5000);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setMessageType("success");
      setStatusMessage("✅ Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
      setTimeout(() => { setStatusMessage(""); setMessageType(""); }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-12 animate-fade-in-up">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-10 text-center
                       bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Section: Contact Form */}
          <div className="bg-gray-50/70 p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  placeholder="Inquiry about Rail Watch"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm resize-y"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl
                           hover:shadow-lg transform hover:scale-[1.01] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                <IoSendOutline className="text-lg" />
                <span>Send Message</span>
              </button>
            </form>
            {statusMessage && (
              <p className={`mt-6 p-3 rounded-lg text-center font-semibold ${
                messageType === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                {statusMessage}
              </p>
            )}
          </div>

          {/* Right Section: Contact Info & Social Links */}
          <div className="bg-gray-50/70 p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              <div className="space-y-6 text-gray-700 text-lg">
                <div className="flex items-center space-x-4">
                  <IoMailOutline className="text-2xl text-indigo-600" />
                  <span>iitg.tidf@gmail.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <IoCallOutline className="text-2xl text-indigo-600" />
                  <span>+91 123 456 7890</span>
                </div>
                <div className="flex items-start space-x-4">
                  <IoLocationOutline className="text-4xl text-indigo-600" /> {/* Updated size and removed mt-0.5 */}
                  <span>Indian Institute of Technology Guwahati, Amingaon, North Guwahati, Guwahati, Assam 781039, India</span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Connect With Us</h3>
              <div className="flex items-center space-x-6 justify-center lg:justify-start">
                <a
                  href="https://github.com/AkarshanGhosh"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 transform hover:scale-125"
                >
                  <IoLogoGithub className="text-4xl" />
                </a>
                <a
                  href="https://www.linkedin.com/in/akarshan-ghosh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 transform hover:scale-125"
                >
                  <IoLogoLinkedin className="text-4xl" />
                </a>
                <a
                  href="https://x.com/AkarshanGhosh28"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter Profile"
                  className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 transform hover:scale-125"
                >
                  <IoLogoTwitter className="text-4xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;