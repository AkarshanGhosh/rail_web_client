import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loder";

const ViewResources = () => {
  const { id } = useParams(); // Extract resource ID from the URL
  const navigate = useNavigate(); // For navigation
  const [data, setData] = useState(null);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  // Check if the user is authenticated
  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Retrieve the token from session storage
    if (!token) {
      // If no token is found, redirect to the login page
      navigate("/login");
    } else {
      setIsAuthenticated(true); // User is authenticated
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          // Fetch train details
          const response = await axios.get(`https://rail-web-server-r7z1.onrender.com/api/division/division-id/${id}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }, // Include token in the request
          });
          const trainDetails = response.data.data;
          setData(trainDetails);

          // Fetch coaches with a POST request
          const coachesResponse = await axios.post(
            "https://rail-web-server-r7z1.onrender.com/api/coach/get-coach",
            { train_Number: trainDetails.train_Number }, // Pass train number in the body
            { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } } // Include token
          );

          if (coachesResponse.data.coaches?.length > 0) {
            setCoaches(coachesResponse.data.coaches);
          } else {
            setCoaches([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error.response?.data || error.message);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id, isAuthenticated]);

  const handleCoachClick = (coach) => {
    // Redirect to CoachDetails with trainNumber and coach as route parameters
    navigate(`/coach-details/${data.train_Number}/${coach}`);
  };

  if (!isAuthenticated) {
    return null; // Return nothing until authentication status is determined
  }

  if (loading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">Failed to load resource. Please try again later.</p>
      </div>
    );
  }

  return (
    data && (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 lg:px-16">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl text-gray-800 font-bold mb-6">Train Details</h1>
          <p className="text-lg text-gray-600 mb-2"><strong>Train Name:</strong> {data.train_Name}</p>
          <p className="text-lg text-gray-600 mb-2"><strong>Train Number:</strong> {data.train_Number}</p>
          <p className="text-lg text-gray-600 mb-2"><strong>Division:</strong> {data.division}</p>
          <p className="text-lg text-gray-600 mb-2"><strong>State:</strong> {data.states}</p>
          <p className="text-lg text-gray-600 mb-6"><strong>City:</strong> {data.cities}</p>

          <h2 className="text-2xl text-gray-800 font-bold mb-4">Available Coaches</h2>
          <div className="flex flex-wrap gap-4">
            {coaches.length > 0 ? (
              coaches.map((coach, index) => (
                <button
                  key={index}
                  onClick={() => handleCoachClick(coach)} // Handle button click
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                  {coach}
                </button>
              ))
            ) : (
              <p className="text-lg text-gray-600">No coaches available for this train.</p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ViewResources;
