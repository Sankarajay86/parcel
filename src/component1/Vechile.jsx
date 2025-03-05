import React, { useState, useEffect } from "react";
import "./vechile.css";
import { db } from "../firebase/firebaseconfig.js";
import { addDoc, collection, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";

const Vehicles = () => {
  const [showModal, setShowModal] = useState(false);
  const [vehName, setVehName] = useState("");
  const [vehfrom, setVehfrom] = useState("");
  const [vehto, setVehto] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [action, setAction] = useState("add");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  const cities = ["Sivakasi", "Karur", "Dindigul", "Erode"];
  const dbRef = collection(db, "Messages");

  useEffect(() => {
    const unsubscribe = onSnapshot(dbRef, (snapshot) => {
      setVehicles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!vehName || !vehfrom || !vehto || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await addDoc(dbRef, { vecName: vehName, vecfrom: vehfrom, vecto: vehto, date, time });
      alert("Vehicle added successfully");
      resetForm();
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const removeVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await deleteDoc(doc(db, "Messages", id));
      alert("Vehicle removed successfully");
    } catch (error) {
      console.error("Error removing vehicle:", error);
    }
  };

  const updateVehicle = async () => {
    if (!vehName || !vehfrom || !vehto || !date || !time) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const vehicleRef = doc(db, "Messages", selectedVehicleId);
      await updateDoc(vehicleRef, { vecName: vehName, vecfrom: vehfrom, vecto: vehto, date, time });
      alert("Vehicle updated successfully");
      resetForm();
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  const handleEdit = (vehicle) => {
    setAction("edit");
    setSelectedVehicleId(vehicle.id);
    setVehName(vehicle.vecName);
    setVehfrom(vehicle.vecfrom);
    setVehto(vehicle.vecto);
    setDate(vehicle.date);
    setTime(vehicle.time);
    setShowModal(true);
  };

  const resetForm = () => {
    setVehName("");
    setVehfrom("");
    setVehto("");
    setDate("");
    setTime("");
    setShowModal(false);
    setSelectedVehicleId(null);
  };

  return (
    <div>
      <button onClick={() => { setAction("add"); setShowModal(true); }}>Add Vehicle</button>
      {showModal && (
        <div className="modal">
          <h2>{action === "add" ? "Add Vehicle" : "Edit Vehicle"}</h2>
          <select value={vehName} onChange={(e) => setVehName(e.target.value)}>
            <option value="" disabled>Select a vehicle</option>
            <option value="Lorries">Lorries/Trucks</option>
            <option value="Mini Trucks">Mini Trucks</option>
            <option value="Container">Container Trucks</option>
            <option value="Van">Van</option>
          </select>
          <select value={vehfrom} onChange={(e) => setVehfrom(e.target.value)}>
            <option value="" disabled>Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select value={vehto} onChange={(e) => setVehto(e.target.value)}>
            <option value="" disabled>Select a city</option>
            {cities.filter((city) => city !== vehfrom).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          <button onClick={action === "add" ? sendMessage : updateVehicle}>
            {action === "add" ? "Add" : "Update"} Vehicle
          </button>
          <button onClick={resetForm}>Cancel</button>
        </div>
      )}
      <div classname="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.vecName}</td>
              <td>{vehicle.vecfrom}</td>
              <td>{vehicle.vecto}</td>
              <td>{vehicle.date}</td>
              <td>{vehicle.time}</td>
              <td>
                <button onClick={() => handleEdit(vehicle)}>Edit</button>
                <button onClick={() => removeVehicle(vehicle.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    </div>
  );
};

export default Vehicles;
