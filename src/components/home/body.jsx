import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";

function Body() {
  // Existing state for chain alerts
  const [chainAlerts, setChainAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Function to fetch active chain status alerts from the server
  const fetchChainAlerts = async () => {
    try {
      // Use the new active-chain-pulls endpoint for robust data
      const response = await fetch('http://localhost:1000/api/coach/active-chain-pulls');
      
      const data = await response.json();
      
      if (response.ok) {
        // Only add new alerts if there are any - don't replace existing ones
        if (data.alerts && data.alerts.length > 0) {
          setChainAlerts(currentAlerts => {
            // Combine existing alerts with new ones, avoiding duplicates
            const existingIds = new Set(currentAlerts.map(alert => alert._id));
            const newAlerts = data.alerts.filter(alert => !existingIds.has(alert._id));
            
            // Add new alerts to the beginning of the array (most recent first)
            return [...newAlerts, ...currentAlerts];
          });
          
          console.log(`Received ${data.alerts.length} new alerts`);
        }
      } else {
        console.error('API Error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching chain alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to dismiss a specific alert
  const handleDismissAlert = (alertToDismiss) => {
    setChainAlerts(currentAlerts =>
      currentAlerts.filter(alert => alert._id !== alertToDismiss._id)
    );
  };

  // Function to clear all alerts (optional - you can add a "Clear All" button)
  const handleClearAllAlerts = () => {
    setChainAlerts([]);
  };

  // PWA install handler
  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('PWA installation is not available at this time.');
      return;
    }

    try {
      // Show the installation prompt
      deferredPrompt.prompt();
      
      // Wait for the user's choice
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User ${outcome} the install prompt`);
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      }
      
      // Clear the deferred prompt
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  // Setup PWA install prompt listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Store the event for later use
      setDeferredPrompt(e);
      setShowInstallButton(true);
      
      console.log('PWA install prompt available');
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for the appinstalled event
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Fetch alerts on component mount and set up polling for real-time updates
  useEffect(() => {
    // Fetch once on component mount
    fetchChainAlerts();
    
    // Poll for updates every 10 seconds to get new alerts
    const interval = setInterval(fetchChainAlerts, 10000);
    
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Function to format timestamp for better readability
  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen lg:h-[75vh] flex flex-col px-4 py-8 lg:px-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      
      {/* Notice Board Section */}
      <div className="w-full mb-8">
        <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-500 overflow-hidden">
          <div className="bg-red-500 text-white px-6 py-3 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Chain Status Notice Board
              {chainAlerts.length > 0 && (
                <span className="ml-2 bg-white text-red-500 px-2 py-1 rounded-full text-sm font-bold">
                  {chainAlerts.length}
                </span>
              )}
            </h2>
            {/* Optional: Clear All button */}
            {chainAlerts.length > 0 && (
              <button
                onClick={handleClearAllAlerts}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors duration-200"
                title="Clear all alerts"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="p-6 max-h-40 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                <span className="ml-2 text-gray-600">Loading alerts...</span>
              </div>
            ) : chainAlerts.length === 0 ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No Chain Pulled - All Systems Normal
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {chainAlerts.map((alert, index) => (
                  <div key={alert._id || index} className="relative bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-red-800 font-semibold">
                          ALERT: Chain Pulled - Train {alert.train_Number}
                        </h3>
                        <p className="text-red-700 text-sm mt-1">
                          Coach: {alert.coach} | Status: {alert.chain_status}
                        </p>
                        <p className="text-red-600 text-xs mt-1">
                          Time: {formatTime(alert.createdAt)}
                        </p>
                        {alert.location && (alert.latitude || alert.longitude) && (
                          <p className="text-red-600 text-xs">
                            Location: {alert.latitude}, {alert.longitude}
                          </p>
                        )}
                      </div>
                      {/* Dismiss Button */}
                      <button 
                        onClick={() => handleDismissAlert(alert)} 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Dismiss Alert"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center flex-1">
        {/* Left Section - Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center mt-8 lg:mt-0 text-center lg:text-left p-4">
          {/* Modern Heading with Gradient */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700 drop-shadow-md">
            Welcome to Rail Watch
          </h1>

          {/* Concise and Punchy Paragraph Text */}
          <p className="mt-6 text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
            Empowering railway employees with real-time train chain monitoring. Ensure safety and operational integrity with instant updates and comprehensive reports.
          </p>

          {/* Button Container */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
            {/* Existing Discover Button */}
            <button
              onClick={() => { /* Add navigation or action here, e.g., navigate('/discover') */ }}
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
            >
              Discover More
            </button>

            {/* PWA Install Button */}
            {showInstallButton && !isInstalled && (
              <button
                onClick={handleInstallPWA}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 cursor-pointer"
                title="Install Rail Watch App"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Install App
              </button>
            )}

            {/* App Installed Message */}
            {isInstalled && (
              <div className="inline-flex items-center px-6 py-2 bg-green-100 text-green-800 rounded-full border border-green-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                App Installed!
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <img
            src={assets.train} // Ensure assets.train points to your image
            alt="train"
            className="w-full max-w-sm lg:max-w-lg object-contain rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
}

export default Body;