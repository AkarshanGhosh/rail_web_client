import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loder"; // Assuming Loader is a well-styled component

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
      <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-xl font-medium">Loading train details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 text-red-700">
        <div className="text-center p-8 rounded-xl bg-white/90 backdrop-blur-sm shadow-xl border border-red-200">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg">Failed to load resource. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    data && (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 flex flex-col items-center p-8 lg:p-12">
        <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 animate-fade-in-up">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-8
                         bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
            Train Details
          </h1>

          <div className="space-y-4 mb-10">
            <p className="text-lg text-gray-700"><strong className="font-semibold text-gray-900">Train Name:</strong> {data.train_Name}</p>
            <p className="text-lg text-gray-700"><strong className="font-semibold text-gray-900">Train Number:</strong> {data.train_Number}</p>
            <p className="text-lg text-gray-700"><strong className="font-semibold text-gray-900">Division:</strong> {data.division}</p>
            <p className="text-lg text-gray-700"><strong className="font-semibold text-gray-900">State:</strong> {data.states}</p>
            <p className="text-lg text-gray-700"><strong className="font-semibold text-gray-900">City:</strong> {data.cities}</p>
          </div>

          <h2 className="text-3xl font-extrabold mb-6
                         bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
            Available Coaches
          </h2>
          <div className="flex flex-wrap gap-4">
            {coaches.length > 0 ? (
              coaches.map((coach, index) => (
                <button
                  key={index}
                  onClick={() => handleCoachClick(coach)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl
                             hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                >
                  {coach}
                </button>
              ))
            ) : (
              <p className="text-xl text-gray-700 font-medium p-4 rounded-xl bg-gray-50/70 border border-gray-200 shadow-sm">
                No coaches available for this train.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ViewResources;