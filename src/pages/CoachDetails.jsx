import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loder";
import Coach from "../components/coach/Coach";

const CoachDetails = () => {
  const navigate = useNavigate(); // For navigation
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [loading, setLoading] = useState(true); // Loading state

  // Check if the user is authenticated
  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Retrieve the token from session storage
    if (!token) {
      // If no token is found, redirect to the login page
      navigate("/login");
    } else {
      setIsAuthenticated(true); // User is authenticated
      setLoading(false); // Stop loading
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Do not render anything until authentication is verified
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Coach />
    </div>
  );
};

export default CoachDetails;
