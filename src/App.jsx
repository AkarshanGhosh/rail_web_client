// Import necessary components and pages
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LogIn from './pages/login';
import Signup from './pages/signup';
import ContactUs from './pages/ContactUs';
import Profile from './pages/Profile';
import { Routes, Route } from "react-router-dom";
import Dashboard from './pages/dashboard';
import ViewResources from './components/viewResources/ViewResources';
import CoachDetails from './pages/CoachDetails'; // Import CoachDetails component
import Admin from './pages/Admin'; // Import AdminBody component

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Render Navbar */}
      <Navbar />
      <div className="flex-grow">
        <Routes>
          {/* Route for Home */}
          <Route path="/" element={<Home />} />

          {/* Route for Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Routes for Authentication */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes for Contact and Profile */}
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />

          {/* Dynamic route for viewing a specific division */}
          <Route path="/division-id/:id" element={<ViewResources />} />

          {/* Dynamic route for viewing coach details */}
          <Route path="/coach-details/:trainNumber/:coach" element={<CoachDetails />} />

          <Route path="/admin-dashboard" element={<Admin />} />

          

          {/* Route for 404 - Page Not Found */}
          <Route
            path="*"
            element={
              <div className="text-center py-16 text-red-600 text-xl">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
