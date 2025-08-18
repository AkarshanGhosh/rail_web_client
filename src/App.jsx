// App.jsx

// Pages & layout
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LogIn from './pages/login';
import Signup from './pages/signup';
import ContactUs from './pages/ContactUs';
import Profile from './pages/Profile';
import Dashboard from './pages/dashboard';
import ViewResources from './components/viewResources/ViewResources';
import CoachDetails from './pages/CoachDetails';
import Admin from './pages/Admin';
import AddTrain from './pages/AddTrain';

import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Add this import

// OPTION A: If you created the separate component earlier, uncomment this:
// import InstallPWA from './components/InstallPWA.jsx';

// OPTION B: Use the lightweight inline version below
function InstallPWAInline() {
  const [deferredPrompt, setDeferredPrompt] = useState(null); // Remove React.
  const [visible, setVisible] = useState(false); // Remove React.
  const [installed, setInstalled] = useState(false); // Remove React.

  useEffect(() => { // Remove React.
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice; // { outcome: 'accepted' | 'dismissed' }
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible || installed) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-5 right-5 z-50 rounded-xl border border-sky-500 bg-white px-4 py-2 text-sky-600 shadow-md hover:bg-sky-50 focus:outline-none"
      aria-label="Install Rail Watch"
      title="Install Rail Watch"
    >
      Install App
    </button>
  );
}

const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Auth */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<Signup />} />

          {/* Contact & Profile */}
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />

          {/* Dynamic routes */}
          <Route path="/division-id/:id" element={<ViewResources />} />
          <Route path="/coach-details/:trainNumber/:coach" element={<CoachDetails />} />

          {/* Admin */}
          <Route path="/admin-dashboard" element={<Admin />} />
          <Route path="/add-train" element={<AddTrain />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="py-16 text-center text-xl text-red-600">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />

      {/* Show the Install button when eligible */}
      {/* OPTION A: <InstallPWA /> */}
      <InstallPWAInline />
    </div>
  );
};

export default App;