import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loder";
import { IoDownloadOutline } from "react-icons/io5";
// Import jspdf and jspdf-autotable
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CoachDetails = () => {
  const { trainNumber, coach } = useParams();
  console.log("CoachDetails component loaded.");
  console.log("Train Number from URL:", trainNumber);
  console.log("Coach UID from URL:", coach);

  const [coachData, setCoachData] = useState([]);
  const [coachInfo, setCoachInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCoachData = async () => {
    if (!trainNumber || !coach) {
      console.warn("Missing trainNumber or coach UID parameter from URL. Cannot fetch data.");
      setLoading(false);
      setError(true);
      setErrorMessage("Missing train number or coach UID in URL parameters.");
      return;
    }

    try {
      const apiUrl = `https://rail-web-server-r7z1.onrender.com/api/coach/get-coach-data?train_Number=${trainNumber}&coach_uid=${coach}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
      });

      console.log("API Response:", response.data);

      if (response.data.train?.length > 0) {
        const sortedData = response.data.train.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
        });

        setCoachData(sortedData);

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
        error.response?.data?.message || "Failed to load coach data. Please check if the train number and coach UID are valid."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachData();
    const interval = setInterval(fetchCoachData, 5000);
    return () => clearInterval(interval);
  }, [trainNumber, coach]);

  const handleDownloadPdf = () => {
    console.log("PDF download initiated.");
    if (coachData.length === 0) {
      alert("No data available to download as PDF.");
      return;
    }

    try {
      const doc = new jsPDF();

      const tableColumn = [
        "Train Number",
        "Train Name",
        "Coach UID",
        "Chain Status",
        "Latitude",
        "Longitude",
        "Humidity (%)",
        "Memory",
        "Error",
        "Date",
        "Time"
      ];

      const tableRows = coachData.map(data => [
        data.train_Number || "N/A",
        data.train_Name || "N/A",
        data.coach_uid || "N/A",
        data.chain_status || "N/A",
        data.latitude || "N/A",
        data.longitude || "N/A",
        data.humidity || "N/A",
        data.memory || "N/A",
        data.error || "N/A",
        data.date || "N/A",
        data.time || "N/A",
      ]);

      doc.setFontSize(18);
      doc.text(`Coach Details Report`, 14, 22);
      doc.setFontSize(12);
      doc.text(`Train: ${coachInfo?.train_Name || trainNumber} (${trainNumber})`, 14, 35);
      doc.text(`Coach: ${coachInfo?.coach_name || 'Unknown'} (UID: ${coach})`, 14, 45);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 55);

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
          0: { cellWidth: 15 },
          1: { cellWidth: 20 },
          2: { cellWidth: 12 },
        }
      });

      const fileName = `coach_details_${trainNumber}_${coach}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
      console.log(`PDF successfully generated: ${fileName}`);
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleDownloadCsv = () => {
    console.log("CSV download initiated.");
    if (coachData.length === 0) {
      alert("No data available to download as CSV.");
      return;
    }

    const headers = [
      "Train Number",
      "Train Name",
      "Coach UID",
      "Chain Status",
      "Latitude",
      "Longitude",
      "Humidity",
      "Memory",
      "Error",
      "Date",
      "Time"
    ];

    const rows = coachData.map(data => [
      data.train_Number || "N/A",
      data.train_Name || "N/A",
      data.coach_uid || "N/A",
      data.chain_status || "N/A",
      data.latitude || "N/A",
      data.longitude || "N/A",
      data.humidity || "N/A",
      data.memory || "N/A",
      data.error || "N/A",
      data.date || "N/A",
      data.time || "N/A",
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Loader />
        <p className="mt-6 text-white text-xl font-semibold">Loading Coach Details</p>
        <p className="mt-2 text-purple-200">Fetching real-time data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Error Loading Data</h2>
          <p className="text-red-200 mb-6">{errorMessage}</p>
          <button
            onClick={() => {
              setError(false);
              setLoading(true);
              fetchCoachData();
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">Coach Details Dashboard</h1>
          <div className="text-purple-200 space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Train:</span> {coachInfo?.train_Name || 'Loading...'} ({trainNumber})
            </p>
            <p className="text-lg">
              <span className="font-semibold">Coach:</span> {coachInfo?.coach_name || 'Loading...'} <span className="ml-2 text-sm">UID: {coach}</span>
            </p>
            <p className="text-sm text-purple-300 mt-4">
              🔴 Live Data - Updates every 5 seconds
            </p>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <IoDownloadOutline size={20} />
              Download PDF
            </button>
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <IoDownloadOutline size={20} />
              Download CSV
            </button>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Real-time Sensor Data</h2>
          <p className="text-purple-200 mb-6">Showing {coachData.length} records (latest first)</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-700/50">
                  <th className="p-4 text-white font-semibold">Train Number</th>
                  <th className="p-4 text-white font-semibold">Train Name</th>
                  <th className="p-4 text-white font-semibold">Coach UID</th>
                  <th className="p-4 text-white font-semibold">Chain Status</th>
                  <th className="p-4 text-white font-semibold">Latitude</th>
                  <th className="p-4 text-white font-semibold">Longitude</th>
                  <th className="p-4 text-white font-semibold">Humidity</th>
                  <th className="p-4 text-white font-semibold">Memory</th>
                  <th className="p-4 text-white font-semibold">Error</th>
                  <th className="p-4 text-white font-semibold">Date</th>
                  <th className="p-4 text-white font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {coachData.length > 0 ? (
                  coachData.map((data, index) => (
                    <tr key={index} className="border-b border-purple-500/30 hover:bg-purple-600/20 transition-colors">
                      <td className="p-4 text-purple-100">{data.train_Number || "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.train_Name || "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.coach_uid || "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.chain_status || "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.latitude || "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.longitude || "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.humidity ? `${data.humidity}%` : "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.memory || "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.error || "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.date || "N/A"}</td>
                      <td className="p-4 text-purple-100">{data.time || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="p-8 text-center text-purple-200">
                      <div className="flex flex-col items-center">
                        <p className="text-xl font-semibold mb-2">No data available</p>
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