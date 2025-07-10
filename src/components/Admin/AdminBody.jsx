import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminBody = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [trains, setTrains] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch all trains
  const getAllTrains = async () => {
    try {
      const response = await axios.get("https://rail-web-server-r7z1.onrender.com/api/division/get-all-trains");
      setTrains(response.data.trains);
      setMessage("Fetched all trains successfully!");
    } catch (error) {
      console.error("Error fetching trains:", error);
      setMessage("Failed to fetch trains.");
    }
  };

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get("https://rail-web-server-r7z1.onrender.com/api/admin/get-all-users");
      setUsers(response.data.users);
      setMessage("Fetched all users successfully!");
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Failed to fetch users.");
    }
  };

  // Delete a train
  const deleteTrain = async (trainId) => {
    try {
      await axios.delete(`https://rail-web-server-r7z1.onrender.com/api/division/delete-train/${trainId}`);
      setMessage("Train deleted successfully!");
      getAllTrains(); // Refresh train list
    } catch (error) {
      console.error("Error deleting train:", error);
      setMessage("Failed to delete train.");
    }
  };

  // Mail all users
  const mailAllUsers = async () => {
    try {
      await axios.post("https://rail-web-server-r7z1.onrender.com/api/admin/mail-all-users");
      setMessage("Emails sent to all users!");
    } catch (error) {
      console.error("Error mailing users:", error);
      setMessage("Failed to send emails.");
    }
  };

  // Load train and user data on component mount
  useEffect(() => {
    getAllTrains();
    getAllUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Train Management Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Train Management</h3>
        <button
          onClick={() => navigate("/add-train")}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Add Train
        </button>
        <button onClick={getAllTrains} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Get All Trains
        </button>
      </div>

      {/* Train List */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Train List</h3>
        <ul className="list-disc pl-5">
          {trains.map((train) => (
            <li key={train.id} className="mb-2 flex justify-between">
              {train.train_Name} - {train.train_Number} ({train.cities})
              <button
                onClick={() => deleteTrain(train.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* User Management Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">User Management</h3>
        <button onClick={getAllUsers} className="bg-purple-500 text-white px-4 py-2 rounded mr-2">
          Get All Users
        </button>
        <button onClick={mailAllUsers} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Mail All Users
        </button>
      </div>

      {/* User List */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">User List</h3>
        <ul className="list-disc pl-5">
          {users.map((user) => (
            <li key={user.id} className="mb-2">
              {user.email} - Role: {user.role}
            </li>
          ))}
        </ul>
      </div>

      {/* Success/Error Message */}
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default AdminBody;
