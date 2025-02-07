import React, { useState } from "react";
import { db } from "../firebase/firebaseconfig.js"; // Ensure Firebase is set up correctly
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./sty.css";
import './Book.css'
const Book = () => {
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    weight: "",
    fromLocation: "",
    toLocation: "",
    numberOfParcels: "",
    deliveryAddress: "",
  });
  const [bookingId, setBookingId] = useState(null);

  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const bookParcel = async () => {
    if (!bookingDetails.name || !bookingDetails.address || !bookingDetails.phone || 
        !bookingDetails.email || !bookingDetails.weight || !bookingDetails.fromLocation || 
        !bookingDetails.toLocation || !bookingDetails.numberOfParcels || !bookingDetails.deliveryAddress) {
      alert("All fields are required!");
      return;
    }

    try {
      // Add parcel details to Firestore without bookingId initially
      const docRef = await addDoc(collection(db, "parcelBookings"), { 
        ...bookingDetails,
        bookingId: "" // Temporary empty value
      });

      // Update Firestore with the generated Booking ID
      await updateDoc(doc(db, "parcelBookings", docRef.id), { bookingId: docRef.id });
      
      // Store bookingId in state for UI use
      setBookingId(docRef.id);

      alert("Parcel booked successfully! Your Booking ID: " + docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const downloadReceipt = () => {
    if (!bookingId) {
      alert("Please book a parcel first!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Parcel Booking Receipt", 105, 10, { align: "center" });

    const tableData = [
      ["Name", bookingDetails.name],
      ["Address", bookingDetails.address],
      ["Phone", bookingDetails.phone],
      ["Email", bookingDetails.email],
      ["Weight", bookingDetails.weight + " kg"],
      ["From", bookingDetails.fromLocation],
      ["To", bookingDetails.toLocation],
      ["Number of Parcels", bookingDetails.numberOfParcels],
      ["Delivery Address", bookingDetails.deliveryAddress],
      ["Booking ID", bookingId],
    ];

    doc.autoTable({ head: [["Field", "Details"]], body: tableData, startY: 20 });
    doc.save("Parcel_Receipt.pdf");
  };

  return (
    <div className="container111">
      <h1>Parcel Booking</h1>

      <div className="input-group">
        <table>
          <tbody>
            <tr>
              <td><input type="text" name="name" placeholder="Full Name" value={bookingDetails.name} onChange={handleChange} /></td>
              <td><input type="text" name="address" placeholder="Address" value={bookingDetails.address} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td><input type="text" name="phone" placeholder="Phone Number" value={bookingDetails.phone} onChange={handleChange} /></td>
              <td><input type="email" name="email" placeholder="Email" value={bookingDetails.email} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td><input type="number" name="weight" placeholder="Weight (kg)" value={bookingDetails.weight} onChange={handleChange} /></td>
              <td>
                <select name="fromLocation" value={bookingDetails.fromLocation} onChange={handleChange}>
                  <option value="">Select From</option>
                  <option value="Erode">Erode</option>
                  <option value="Dindigul">Dindigul</option>
                  <option value="Karur">Karur</option>
                  <option value="Sivakasi">Sivakasi</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <select name="toLocation" value={bookingDetails.toLocation} onChange={handleChange}>
                  <option value="">Select To</option>
                  <option value="Erode">Erode</option>
                  <option value="Dindigul">Dindigul</option>
                  <option value="Karur">Karur</option>
                  <option value="Sivakasi">Sivakasi</option>
                </select>
              </td>
              <td><input type="number" name="numberOfParcels" placeholder="Number of Parcels" value={bookingDetails.numberOfParcels} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td colSpan="2"><input type="text" name="deliveryAddress" placeholder="Delivery Address" value={bookingDetails.deliveryAddress} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>
        <button onClick={bookParcel}>Book Parcel</button>
        <button onClick={downloadReceipt}>Download Receipt</button>
      </div>
    </div>
  );
};

export default Book;
