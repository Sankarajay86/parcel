import React, { useState, useEffect } from "react";
import "./vechile.css";
import { db } from "../firebase/firebaseconfig.js";
import { addDoc, collection, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";

const Vehicles = () => {
  const [showModal, setShowModal] = useState(false);
  const [vehName, setVehName] = useState("");
  const [vehfrom, setVehfrom] = useState("");
  const [vehto, setVehto] = useState("");
  const [action, setAction] = useState("add");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  const cities = ["Sivakasi", "Karur", "Dindigul", "Erode"];
  const dbRef = collection(db, "Messages");

  // Fetch vehicles from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(dbRef, (snapshot) => {
      setVehicles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Add a vehicle to Firestore
  const sendMessage = async () => {
    if (!vehName || !vehfrom || !vehto) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(dbRef, { vecName: vehName, vecfrom: vehfrom, vecto: vehto });
      alert("Vehicle added successfully");
      resetForm();
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  // Remove a vehicle from Firestore
  const removeVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await deleteDoc(doc(db, "Messages", id));
      alert("Vehicle removed successfully");
    } catch (error) {
      console.error("Error removing vehicle:", error);
    }
  };

  // Edit vehicle information
  const updateVehicle = async () => {
    if (!vehName || !vehfrom || !vehto) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const vehicleRef = doc(db, "Messages", selectedVehicleId);
      await updateDoc(vehicleRef, { vecName: vehName, vecfrom: vehfrom, vecto: vehto });
      alert("Vehicle updated successfully");
      resetForm();
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  // Handle Edit button click
  const handleEdit = (vehicle) => {
    setAction("edit");
    setSelectedVehicleId(vehicle.id);
    setVehName(vehicle.vecName);
    setVehfrom(vehicle.vecfrom);
    setVehto(vehicle.vecto);
    setShowModal(true);
  };

  // Reset form fields
  const resetForm = () => {
    setVehName("");
    setVehfrom("");
    setVehto("");
    setShowModal(false);
    setSelectedVehicleId(null);
  };

  return (
    <div>
      <div className="insights">
        <button onClick={() => { setAction("add"); setShowModal(true); }} className="add-vehicle-btn">
          Add Vehicle
        </button>
      </div>

      <div className="user-list">
        {vehicles.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white text-left text-sm sm:text-base">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">From</th>
              <th className="p-3 border-b">To</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="hover:bg-gray-100 transition duration-200 text-sm sm:text-base"
              >
                <td className="p-3 border-b border-gray-200">{vehicle.vecName}</td>
                <td className="p-3 border-b border-gray-200">{vehicle.vecfrom}</td>
                <td className="p-3 border-b border-gray-200">{vehicle.vecto}</td>
                <td className="p-3 border-b border-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeVehicle(vehicle.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleEdit(vehicle)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
          <p>No vehicles found.</p>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{action === "add" ? "Add Vehicle" : "Edit Vehicle"}</h2>
            <div className="form-group">
              <label>Vehicle Name:</label>
              <select value={vehName} onChange={(e) => setVehName(e.target.value)} className="vehicle-select">
                <option value="" disabled>Select a vehicle</option>
                <option value="Lorries">Lorries/Trucks</option>
                <option value="Mini Trucks">Mini Trucks</option>
                <option value="Container">Container Trucks</option>
                <option value="Van">Van</option>
              </select>
            </div>
            <div className="form-group">
              <label>From:</label>
              <select value={vehfrom} onChange={(e) => setVehfrom(e.target.value)} className="city-select">
                <option value="" disabled>Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>To:</label>
              <select value={vehto} onChange={(e) => setVehto(e.target.value)} className="city-select">
                <option value="" disabled>Select a city</option>
                {cities.filter((city) => city !== vehfrom).map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button onClick={action === "add" ? sendMessage : updateVehicle}>
                {action === "add" ? "Add" : "Update"} Vehicle
              </button>
              <button onClick={resetForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
