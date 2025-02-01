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
  const cities = ["Sivakasi", "Karur", "Dindigul", "Houston"];
  const dbRef = collection(db, "Messages");

  // Add a vehicle to Firestore
  const sendMessage = async () => {
    try {
      const added = await addDoc(dbRef, {
        vecName: vehName,
        vecfrom: vehfrom,
        vecto: vehto,
      });

      if (added) {
        alert("Vehicle added successfully");
      }

      // Reset fields and close modal
      setVehName("");
      setVehfrom("");
      setVehto("");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  // Remove a vehicle from Firestore
  const removeVehicle = async (id) => {
    try {
      await deleteDoc(doc(db, "Messages", id));
      alert("Vehicle removed successfully");
    } catch (error) {
      console.error("Error removing vehicle:", error);
    }
  };

  // Edit vehicle information
  const updateVehicle = async () => {
    const updatedData = {
      vecName: vehName,
      vecType: vehfrom,
      vecModel: vehto,
    };

    try {
      const vehicleRef = doc(db, "Messages", selectedVehicleId);
      await updateDoc(vehicleRef, updatedData);
      alert("Vehicle updated successfully");

      // Reset fields and close modal
      setVehName("");
      setVehfrom("");
      setVehto("");
      setShowModal(false);
      setSelectedVehicleId(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  // Fetch vehicles from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(dbRef, (snapshot) => {
      const fetchedVehicles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicles(fetchedVehicles);
    });

    return () => unsubscribe();
  }, []);

  // Handle Edit button click
  const handleEdit = (vehicle) => {
    setAction("edit");
    setSelectedVehicleId(vehicle.id);
    setVehName(vehicle.vecName);
    setVehfrom(vehicle.vecType);
    setVehto(vehicle.vecModel);
    setShowModal(true);
  };

  return (
    <div>
      <div className="insights">
        <button
          onClick={() => {
            setAction("add");
            setShowModal(true);
          }}
          className="add-vehicle-btn"
        >
          Add Vehicle
        </button>
      </div>

      <div className="user-list">
        {vehicles.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>From</th>
                <th>To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.vecName}</td>
                  <td>{vehicle.vecfrom}</td>
                  <td>{vehicle.vecto}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => removeVehicle(vehicle.id)}
                        className="remove-vehicle-btn"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="edit-vehicle-btn"
                      >
                        Edits
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
              <select
                value={vehName}
                onChange={(e) => setVehName(e.target.value)}
                className="vehicle-select"
              >
                <option value="" disabled>
                  Select a vehicle
                </option>
                <option value="Lorries">Lorries/Trucks</option>
                <option value="Mini Trucks">Mini Trucks</option>
                <option value="Container">Container Trucks</option>
                <option value="Van">Van</option>
              </select>
            </div>
            <div className="form-group">
              <label>From:</label>
              <select
                value={vehfrom}
                onChange={(e) => setVehfrom(e.target.value)}
                className="city-select"
              >
                <option value="" disabled>
                  Select a city
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>To:</label>
              <select
                value={vehto}
                onChange={(e) => setVehto(e.target.value)}
                className="city-select"
              >
                <option value="" disabled>
                  Select a city
                </option>
                {cities
                  .filter((city) => city !== vehfrom) // Filter out the selected "From" city
                  .map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button onClick={action === "add" ? sendMessage : updateVehicle}>
                {action === "add" ? "Add" : "Update"} Vehicle
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
