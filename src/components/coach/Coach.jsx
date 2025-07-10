import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loder";

const CoachDetails = () => {
  const { trainNumber, coach } = useParams(); // Extract trainNumber and coach from the URL
  const [coachData, setCoachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        // Construct the API URL with query parameters
        const apiUrl = `https://rail-web-server-r7z1.onrender.com/api/coach/get-coach-data?train_Number=${trainNumber}&coach=${coach}`;

        const response = await axios.get(apiUrl);

        if (response.data.train?.length > 0) {
          // Sort the data by the latest using date and time
          const sortedData = response.data.train.sort(
            (a, b) =>
              new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
          );
          setCoachData(sortedData);
        } else {
          setCoachData([]); // No data fallback
        }
      } catch (error) {
        console.error("Error fetching coach data:", error.response?.data || error.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data initially and set up a 3-second interval for live updates
    fetchCoachData();
    const interval = setInterval(fetchCoachData, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [trainNumber, coach]);

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
        <p className="text-red-500">Failed to load coach data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 lg:px-16">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl text-gray-800 font-bold mb-6">Coach Details</h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Train Number</th>
                <th className="border border-gray-300 px-4 py-2">Coach</th>
                <th className="border border-gray-300 px-4 py-2">Latitude</th>
                <th className="border border-gray-300 px-4 py-2">Longitude</th>
                <th className="border border-gray-300 px-4 py-2">Chain Status</th>
                <th className="border border-gray-300 px-4 py-2">Temperature</th>
                <th className="border border-gray-300 px-4 py-2">Humidity</th>
                <th className="border border-gray-300 px-4 py-2">Memory</th>
                <th className="border border-gray-300 px-4 py-2">Error</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {coachData.length > 0 ? (
                coachData.map((data, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{data.train_Number || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.coach || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.latitude || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.longitude || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.chain_status || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.temperature || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.humidity || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.memory || "000"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.error || "000"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.date || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2">{data.time || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center border border-gray-300 px-4 py-2">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CoachDetails;
