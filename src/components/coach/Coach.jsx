import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loder";
import { IoDownloadOutline } from "react-icons/io5";

// Import jspdf and jspdf-autotable
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CoachDetails = () => {
  const { trainNumber, coach } = useParams(); // coach is actually coach_uid from URL
  
  console.log("CoachDetails component loaded.");
  console.log("Train Number from URL:", trainNumber);
  console.log("Coach UID from URL:", coach);

  const [coachData, setCoachData] = useState([]);
  const [coachInfo, setCoachInfo] = useState(null); // To store coach name and other details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to fetch coach data
  const fetchCoachData = async () => {
    if (!trainNumber || !coach) {
      console.warn("Missing trainNumber or coach UID parameter from URL. Cannot fetch data.");
      setLoading(false);
      setError(true);
      setErrorMessage("Missing train number or coach UID in URL parameters.");
      return;
    }

    try {
      // Updated API URL with correct parameter name
      const apiUrl = `https://rail-web-server-r7z1.onrender.com/api/coach/get-coach-data?train_Number=${trainNumber}&coach_uid=${coach}`;
      
      const response = await axios.get(apiUrl, {
        headers: { 
          Authorization: `Bearer ${sessionStorage.getItem("token")}` 
        }
      });

      console.log("API Response:", response.data);

      if (response.data.train?.length > 0) {
        // Sort the data by createdAt or date/time (descending order - latest first)
        const sortedData = response.data.train.sort((a, b) => {
          // Use createdAt if available, otherwise fall back to date/time
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
        });
        
        setCoachData(sortedData);
        
        // Set coach info from the first record (they should all have the same coach info)
        if (sortedData[0]) {
          setCoachInfo({
            coach_uid: sortedData[0].coach_uid,
            coach_name: sortedData[0].coach_name || `Coach ${sortedData[0].coach_uid}`,
            train_Number: sortedData[0].train_Number,
            train_Name: sortedData[0].train_Name || 'Unknown Train'
          });
        }
      } else {
        setCoachData([]);
        setErrorMessage("No data available for this coach.");
      }
    } catch (error) {
      console.error("Error fetching coach data:", error.response?.data || error.message);
      setError(true);
      setErrorMessage(
        error.response?.data?.message || 
        "Failed to load coach data. Please check if the train number and coach UID are valid."
      );
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch data initially and set up a 5-second interval for live updates
  useEffect(() => {
    fetchCoachData();
    const interval = setInterval(fetchCoachData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, [trainNumber, coach]);

  // Function to handle PDF download
  const handleDownloadPdf = () => {
    console.log("PDF download initiated.");
    
    if (coachData.length === 0) {
      alert("No data available to download as PDF.");
      return;
    }

    try {
      const doc = new jsPDF();

      // Define columns for the PDF table
      const tableColumn = [
        "Train Number", "Train Name", "Coach UID", "Coach Name", "Chain Status",
        "Latitude", "Longitude", "Temperature (°C)", "Humidity (%)", 
        "Memory", "Error", "Date", "Time"
      ];

      // Prepare rows from coachData
      const tableRows = coachData.map(data => [
        data.train_Number || "N/A",
        data.train_Name || "N/A",
        data.coach_uid || "N/A",
        data.coach_name || "N/A",
        data.chain_status || "N/A",
        data.latitude || "N/A",
        data.longitude || "N/A",
        data.temperature || "N/A",
        data.humidity || "N/A",
        data.memory || "N/A",
        data.error || "N/A",
        data.date || "N/A",
        data.time || "N/A",
      ]);

      // Set document title
      doc.setFontSize(18);
      doc.text(`Coach Details Report`, 14, 22);
      
      doc.setFontSize(12);
      doc.text(`Train: ${coachInfo?.train_Name || trainNumber} (${trainNumber})`, 14, 35);
      doc.text(`Coach: ${coachInfo?.coach_name || 'Unknown'} (UID: ${coach})`, 14, 45);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 55);

      // Add autoTable to the document
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 65,
        theme: 'grid',
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [75, 0, 130],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 15 }, // Train Number
          1: { cellWidth: 20 }, // Train Name
          2: { cellWidth: 12 }, // Coach UID
          3: { cellWidth: 18 }, // Coach Name
        }
      });

      // Save the PDF
      const fileName = `coach_details_${trainNumber}_${coach}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
      console.log(`PDF successfully generated: ${fileName}`);

    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Function to handle CSV download
  const handleDownloadCsv = () => {
    console.log("CSV download initiated.");
    if (coachData.length === 0) {
      alert("No data available to download as CSV.");
      return;
    }

    // Define CSV headers
    const headers = [
      "Train Number", "Train Name", "Coach UID", "Coach Name", "Chain Status",
      "Latitude", "Longitude", "Temperature", "Humidity", "Memory", "Error", "Date", "Time"
    ];

    // Map coachData to CSV rows
    const rows = coachData.map(data => [
      data.train_Number || "N/A",
      data.train_Name || "N/A",
      data.coach_uid || "N/A",
      data.coach_name || "N/A",
      data.chain_status || "N/A",
      data.latitude || "N/A",
      data.longitude || "N/A",
      data.temperature || "N/A",
      data.humidity || "N/A",
      data.memory || "N/A",
      data.error || "N/A",
      data.date || "N/A",
      data.time || "N/A",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `coach_details_${trainNumber}_${coach}_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("CSV download completed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0" 
                 style={{borderRightColor: 'transparent', animationDirection: 'reverse', animationDuration: '1s'}}></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Coach Details</h2>
            <p className="text-gray-600">Fetching real-time data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
        <div className="text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm shadow-2xl border border-red-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error Loading Data</h2>
          <p className="text-red-600 mb-6">{errorMessage}</p>
          <button 
            onClick={() => {
              setError(false);
              setLoading(true);
              fetchCoachData();
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl 
                       transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent 
                           bg-gradient-to-r from-indigo-600 to-purple-600">
                Coach Details Dashboard
              </h1>
              <div className="space-y-2 text-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700">Train:</span>
                  <span className="font-bold text-gray-900">
                    {coachInfo?.train_Name || 'Loading...'} ({trainNumber})
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-700">Coach:</span>
                  <span className="font-bold text-gray-900">
                    {coachInfo?.coach_name || 'Loading...'} 
                  </span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    UID: {coach}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live Data - Updates every 5 seconds</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 
                         text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl
                         transform hover:scale-105 transition-all duration-300"
              >
                <IoDownloadOutline className="text-lg" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={handleDownloadCsv}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-teal-600 
                         text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl
                         transform hover:scale-105 transition-all duration-300"
              >
                <IoDownloadOutline className="text-lg" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Real-time Sensor Data</h2>
            <p className="text-gray-600 mt-1">
              Showing {coachData.length} records (latest first)
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="px-4 py-4 text-left font-semibold">Train Number</th>
                  <th className="px-4 py-4 text-left font-semibold">Train Name</th>
                  <th className="px-4 py-4 text-left font-semibold">Coach UID</th>
                  <th className="px-4 py-4 text-left font-semibold">Coach Name</th>
                  <th className="px-4 py-4 text-left font-semibold">Chain Status</th>
                  <th className="px-4 py-4 text-left font-semibold">Latitude</th>
                  <th className="px-4 py-4 text-left font-semibold">Longitude</th>
                  <th className="px-4 py-4 text-left font-semibold">Temperature</th>
                  <th className="px-4 py-4 text-left font-semibold">Humidity</th>
                  <th className="px-4 py-4 text-left font-semibold">Memory</th>
                  <th className="px-4 py-4 text-left font-semibold">Error</th>
                  <th className="px-4 py-4 text-left font-semibold">Date</th>
                  <th className="px-4 py-4 text-left font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {coachData.length > 0 ? (
                  coachData.map((data, index) => (
                    <tr key={data._id || index} 
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors
                                  ${index === 0 ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-3 text-gray-700 font-medium">{data.train_Number || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-700">{data.train_Name || "N/A"}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                          {data.coach_uid || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{data.coach_name || "N/A"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          data.chain_status?.toLowerCase() === 'intact' || data.chain_status?.toLowerCase() === 'normal' 
                            ? 'bg-green-100 text-green-800' :
                          data.chain_status?.toLowerCase() === 'pulled' 
                            ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {data.chain_status || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-sm">{data.latitude || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-sm">{data.longitude || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {data.temperature ? `${data.temperature}°C` : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {data.humidity ? `${data.humidity}%` : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-sm">{data.memory || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-sm">{data.error || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-700">{data.date || "N/A"}</td>
                      <td className="px-4 py-3 text-gray-700">{data.time || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center px-4 py-12 text-gray-500">
                      <div className="flex flex-col items-center space-y-3">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">No data available</p>
                        <p className="text-sm">No sensor data found for this coach.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDetails;