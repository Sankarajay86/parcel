import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig.js";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./sty.css";
import "./Book.css";
import { useLocation } from "react-router-dom";

const Book = () => {
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState({
    senderName: "",
    senderPhone: "",
    pickupAddress: "",
    receiverName: "",
    receiverPhone: "",
    deliveryAddress: "",
    weightDimensions: "",
    itemType: "",
    insurance: "",
    fromLocation: location.state?.from || "",
    toLocation: location.state?.to || "",
  });
  const [bookingId, setBookingId] = useState(null);

  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const bookParcel = async () => {
    if (!Object.values(bookingDetails).every((field) => field)) {
      alert("All fields are required!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "parcelBookings"), {
        ...bookingDetails,
        bookingId: "",
      });

      await updateDoc(doc(db, "parcelBookings", docRef.id), { bookingId: docRef.id });
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

    const tableData = Object.entries({ ...bookingDetails, BookingID: bookingId });
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
              <td colSpan="2"><strong>From (Sender) Details</strong></td>
              <td colSpan="2"><strong>To (Receiver) Details</strong></td>
            </tr>
            <tr>
              <td colSpan="2">From: {bookingDetails.fromLocation}</td>
              <td colSpan="2">To: {bookingDetails.toLocation}</td>
            </tr>
            <tr>
              <td><input type="text" name="senderName" placeholder="Sender Name" value={bookingDetails.senderName} onChange={handleChange} /></td>
              <td><input type="text" name="senderPhone" placeholder="Phone Number" value={bookingDetails.senderPhone} onChange={handleChange} /></td>
              <td><input type="text" name="receiverName" placeholder="Receiver Name" value={bookingDetails.receiverName} onChange={handleChange} /></td>
              <td><input type="text" name="receiverPhone" placeholder="Phone Number" value={bookingDetails.receiverPhone} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td colSpan="2"><input type="text" name="pickupAddress" placeholder="Pickup Address" value={bookingDetails.pickupAddress} onChange={handleChange} /></td>
              <td colSpan="2"><input type="text" name="deliveryAddress" placeholder="Delivery Address" value={bookingDetails.deliveryAddress} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td colSpan="2"><strong>Parcel Details</strong></td>
            </tr>
            <tr>
              <td><input type="text" name="weightDimensions" placeholder="Weight & Dimensions" value={bookingDetails.weightDimensions} onChange={handleChange} /></td>
              <td><input type="text" name="itemType" placeholder="Type of Item (Documents, Electronics, etc.)" value={bookingDetails.itemType} onChange={handleChange} /></td>
              <td colSpan="2"><input type="text" name="insurance" placeholder="Insurance (If required)" value={bookingDetails.insurance} onChange={handleChange} /></td>
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
