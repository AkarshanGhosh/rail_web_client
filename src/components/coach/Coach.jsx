import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loder"; // Assuming your Loader component path is correct
import { IoDownloadOutline } from "react-icons/io5"; // Import download icon

// Import jspdf and jspdf-autotable
import jsPDF from 'jspdf';
// Option A: Standard side-effect import (most common and usually sufficient)
import 'jspdf-autotable';
// Option B: Explicit plugin application (try this ONLY if Option A still fails after clean install)
// import { applyPlugin } from 'jspdf-autotable';
// applyPlugin(jsPDF);


const CoachDetails = () => {
  // --- CRUCIAL: Ensure these are at the very beginning of the component function ---
  const { trainNumber, coach } = useParams(); // Extract trainNumber and coach from the URL

  // Add these console logs to confirm useParams is working
  console.log("CoachDetails component loaded.");
  console.log("Train Number from URL (useParams):", trainNumber);
  console.log("Coach from URL (useParams):", coach);
  // --- END CRUCIAL SECTION ---


  const [coachData, setCoachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Function to fetch coach data
  const fetchCoachData = async () => {
    // Check if trainNumber or coach are undefined before making API call
    if (!trainNumber || !coach) {
      console.warn("Missing trainNumber or coach parameter from URL. Cannot fetch data.");
      setLoading(false);
      setError(true);
      return;
    }

    try {
      // Construct the API URL with query parameters
      const apiUrl = `https://rail-web-server-r7z1.onrender.com/api/coach/get-coach-data?train_Number=${trainNumber}&coach=${coach}`;

      const response = await axios.get(apiUrl);

      if (response.data.train?.length > 0) {
        // Sort the data by the latest using date and time (descending order)
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

  // Effect hook to fetch data initially and set up a 3-second interval for live updates
  useEffect(() => {
    fetchCoachData();
    const interval = setInterval(fetchCoachData, 3000); // Fetch data every 3 seconds

    // Cleanup interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, [trainNumber, coach]); // Re-run effect if trainNumber or coach changes

  // Function to handle PDF download
  const handleDownloadPdf = () => {
    console.log("handleDownloadPdf function initiated.");
    console.log("Coach data available for PDF:", coachData.length > 0 ? "Yes" : "No", "Length:", coachData.length);

    // Critical Debugging Logs for jsPDF
    console.log("Checking jsPDF and autoTable availability:");
    console.log("typeof jsPDF:", typeof jsPDF);
    console.log("typeof jsPDF.autoTable (direct static method):", typeof jsPDF.autoTable);
    console.log("typeof jsPDF.prototype.autoTable:", typeof jsPDF.prototype.autoTable); // THIS IS THE MOST IMPORTANT

    if (coachData.length === 0) {
      alert("No data available to download as PDF. Please ensure data is loaded.");
      console.warn("PDF generation aborted: No coach data to process.");
      return;
    }

    try {
      const doc = new jsPDF();

      // Debugging logs for the instance
      console.log("jsPDF instance 'doc' created:", doc);
      console.log("typeof doc.autoTable (instance method):", typeof doc.autoTable);

      // Define columns for the PDF table
      const tableColumn = [
        "Train Number", "Coach", "Latitude", "Longitude", "Chain Status",
        "Temperature", "Humidity", "Memory", "Error", "Date", "Time"
      ];

      // Prepare rows from coachData
      const tableRows = coachData.map(data => [
        data.train_Number || "N/A",
        data.coach || "N/A",
        data.latitude || "N/A",
        data.longitude || "N/A",
        data.chain_status || "N/A",
        data.temperature || "N/A",
        data.humidity || "N/A",
        data.memory || "000",
        data.error || "000",
        data.date || "N/A",
        data.time || "N/A",
      ]);

      // Set document title and add it to the PDF
      doc.setFontSize(18);
      // Accessing trainNumber and coach here is correct because they are in scope
      doc.text(`Coach Details for Train ${trainNumber}, Coach ${coach}`, 14, 22);

      // Add autoTable to the document
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [75, 0, 130],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });

      // Save the PDF
      // Accessing trainNumber and coach here is correct
      const fileName = `coach_details_${trainNumber}_${coach}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
      console.log(`PDF successfully generated: ${fileName}`);

    } catch (pdfError) {
      console.error("An error occurred during PDF generation:", pdfError);
      alert("Failed to generate PDF. Please check your browser console for detailed error messages.");
    }
  };

  // Function to handle CSV download
  const handleDownloadCsv = () => {
    console.log("CSV download initiated.");
    if (coachData.length === 0) {
      alert("No data available to download as CSV.");
      console.warn("CSV download aborted: No data in coachData.");
      return;
    }

    // Define CSV headers
    const headers = [
      "Train Number", "Coach", "Latitude", "Longitude", "Chain Status",
      "Temperature", "Humidity", "Memory", "Error", "Date", "Time"
    ];

    // Map your coachData to CSV rows
    const rows = coachData.map(data => [
      data.train_Number || "N/A",
      data.coach || "N/A",
      data.latitude || "N/A",
      data.longitude || "N/A",
      data.chain_status || "N/A",
      data.temperature || "N/A",
      data.humidity || "N/A",
      data.memory || "000",
      data.error || "000",
      data.date || "N/A",
      data.time || "N/A",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link element and trigger the download
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      // Accessing trainNumber and coach here is correct
      link.setAttribute("download", `coach_details_${trainNumber}_${coach}_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("CSV download initiated successfully.");
    } else {
      alert("Your browser does not support automatic CSV download. Please copy the data manually.");
    }
  };


  // Conditional rendering for loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Conditional rendering for error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold">Failed to load coach data. Please ensure the train number and coach are valid in the URL, or try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center py-8 px-4 lg:px-16">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl text-gray-800 font-bold mb-4 md:mb-0">
            Coach Details: Train {trainNumber}, Coach {coach}
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white
                         px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg
                         transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <IoDownloadOutline className="text-lg" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-600 text-white
                         px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg
                         transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <IoDownloadOutline className="text-lg" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <th className="px-4 py-3 text-left font-semibold rounded-tl-xl">Train Number</th>
                <th className="px-4 py-3 text-left font-semibold">Coach</th>
                <th className="px-4 py-3 text-left font-semibold">Latitude</th>
                <th className="px-4 py-3 text-left font-semibold">Longitude</th>
                <th className="px-4 py-3 text-left font-semibold">Chain Status</th>
                <th className="px-4 py-3 text-left font-semibold">Temperature</th>
                <th className="px-4 py-3 text-left font-semibold">Humidity</th>
                <th className="px-4 py-3 text-left font-semibold">Memory</th>
                <th className="px-4 py-3 text-left font-semibold">Error</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold rounded-tr-xl">Time</th>
              </tr>
            </thead>
            <tbody>
              {coachData.length > 0 ? (
                coachData.map((data, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700">{data.train_Number || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-700">{data.coach || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-700">{data.latitude || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-700">{data.longitude || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        data.chain_status === 'Intact' ? 'bg-green-100 text-green-800' :
                        data.chain_status === 'Pulled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {data.chain_status || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{data.temperature || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-700">{data.humidity || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-700">{data.memory || "000"}</td>
                    <td className="px-4 py-3 text-gray-700">{data.error || "000"}</td>
                    <td className="px-4 py-3 text-gray-700">{data.date || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-700">{data.time || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center px-4 py-8 text-gray-500">
                    No data available for this coach.
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