import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import Loader from "../components/Loder";
import ResourceCard from "../components/ResourceCard/ResourceCard";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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

  // Fetch all resources if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://rail-web-server-r7z1.onrender.com/api/division/get-all-division", {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }, // Include token in the request
          });
          const formattedData = response.data.data.map((item) => ({
            ...item,
            trainName: item.train_Name || "",
            trainNumber: item.train_Number || "",
            division: item.division || "",
            state: item.states || "",
            cities: item.cities || "",
          }));
          setData(formattedData);
          setFilteredData(formattedData); // Set initial filtered data
          console.log("Fetched All Data:", formattedData); // Debug fetched data
        } catch (error) {
          console.error("Error fetching all resources:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter data based on search term
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter((item) => {
      return (
        (item.trainName?.toLowerCase().includes(lowerSearchTerm) || "") ||
        (item.trainNumber?.toString().includes(lowerSearchTerm) || "") ||
        (item.division?.toLowerCase().includes(lowerSearchTerm) || "") ||
        (item.state?.toLowerCase().includes(lowerSearchTerm) || "") ||
        (item.cities?.toLowerCase().includes(lowerSearchTerm) || "")
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, data]);

  if (!isAuthenticated) {
    return null; // Return nothing until authentication status is determined
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 px-8 lg:px-16 py-8">
      <h4 className="text-4xl lg:text-5xl font-semibold text-gray-800 mb-8 text-center">Dashboard</h4>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by train name, number, division, state, or cities..."
          className="w-full max-w-2xl p-4 rounded-lg text-gray-800 bg-gray-50 border border-gray-300 focus:outline-none focus:ring focus:ring-green-400 shadow-md"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Display Filtered Data */}
          {filteredData.length > 0 ? (
            filteredData.map((item, i) => <ResourceCard key={i} data={item} />)
          ) : (
            <p className="text-center text-red-500 text-xl font-semibold">No resources found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
