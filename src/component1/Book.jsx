import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig.js";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./sty.css";
import "./Book.css";
import { useLocation } from "react-router-dom";
import FilePayment from "./FilePayment.jsx";

const Book = () => {
  const location = useLocation();
  const fromLocation = location.state?.from || "";
  const toLocation = location.state?.to || "";

  const [displayName, setDisplayName] = useState("Guest");
  const [weight, setWeight] = useState(0);
  const [distance, setDistance] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [bookingId, setBookingId] = useState(null);

  // Predefined distances
  const distanceMatrix = {
    "Sivakasi-Karur": 150,
    "Sivakasi-Dindigul": 100,
    "Sivakasi-Erode": 200,
    "Karur-Dindigul": 85,
    "Karur-Erode": 120,
    "Dindigul-Erode": 180,
  };

  const baseFee = 50;
  const weightRate = 3;
  const distanceRate = 2;

  // Set display name from state or local storage
  useEffect(() => {
    if (location.state?.displayName) {
      setDisplayName(location.state.displayName);
      localStorage.setItem("displayName", location.state.displayName);
    } else if (localStorage.getItem("displayName")) {
      setDisplayName(localStorage.getItem("displayName"));
    }
  }, [location.state]);

  // Calculate and update distance based on locations
  useEffect(() => {
    const routeKey = `${fromLocation}-${toLocation}`;
    if (distanceMatrix[routeKey]) {
      setDistance(distanceMatrix[routeKey]);
    } else {
      setDistance(0); // Default to 0 if route is not found
    }
  }, [fromLocation, toLocation]);

  // Calculate delivery charge when weight or distance changes
  useEffect(() => {
    if (weight > 0 && distance > 0) {
      setDeliveryCharge(baseFee + weight * weightRate + distance * distanceRate);
    } else {
      setDeliveryCharge(0);
    }
  }, [weight, distance]);

  const [bookingDetails, setBookingDetails] = useState({
    senderName: "",
    senderPhone: "",
    pickupAddress: "",
    receiverName: "",
    receiverPhone: "",
    deliveryAddress: "",
    itemType: "Documents",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const bookParcel = async (paymentId) => {
    try {
      const docRef = await addDoc(collection(db, "parcelBookings"), {
        ...bookingDetails,
        displayName,
        fromLocation,
        toLocation,
        distance,
        weight,
        deliveryCharge,
        paymentId,
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
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Parcel Booking Receipt", 105, 10, { align: "center" });

    const tableData = Object.entries({
      ...bookingDetails,
      displayName,
      BookingID: bookingId || "N/A",
      Distance: distance,
      Weight: weight,
      DeliveryCharge: deliveryCharge,
      PaymentID: paymentId || "N/A",
    }).map(([key, value]) => [key, value]);

    doc.autoTable({ head: [["Field", "Details"]], body: tableData, startY: 20 });
    doc.save("Parcel_Receipt.pdf");
  };

  const allFieldsFilled = () => {
    return Object.values(bookingDetails).every((field) => field) && weight > 0;
  };

  return (
    <div className="container111">
      <h1>Parcel Booking</h1>
      <h3>Booking for: {displayName}</h3>
      
      <table className="booking-table">
        <tbody>
          <tr><td>From:</td><td>{fromLocation}</td></tr>
          <tr><td>To:</td><td>{toLocation}</td></tr>
          <tr><td>Sender Name:</td><td><input type="text" name="senderName" value={bookingDetails.senderName} onChange={handleChange} /></td></tr>
          <tr><td>Sender Phone:</td><td><input type="tel" name="senderPhone" maxLength="10" value={bookingDetails.senderPhone} onChange={handleChange} /></td></tr>
          <tr><td>Pickup Address:</td><td><input type="text" name="pickupAddress" value={bookingDetails.pickupAddress} onChange={handleChange} /></td></tr>
          <tr><td>Receiver Name:</td><td><input type="text" name="receiverName" value={bookingDetails.receiverName} onChange={handleChange} /></td></tr>
          <tr><td>Receiver Phone:</td><td><input type="tel" name="receiverPhone" maxLength="10" value={bookingDetails.receiverPhone} onChange={handleChange} /></td></tr>
          <tr><td>Delivery Address:</td><td><input type="text" name="deliveryAddress" value={bookingDetails.deliveryAddress} onChange={handleChange} /></td></tr>
          <tr><td>Weight (kg):</td><td><input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} /></td></tr>
          <tr>
            <td>Item Type:</td>
            <td>
              <select name="itemType" value={bookingDetails.itemType} onChange={handleChange}>
                <option value="Documents">Documents & Papers</option>
                <option value="Books">Books & Magazines</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothes">Clothes & Apparel</option>
                <option value="Medicines">Medicines & Healthcare Products</option>
                <option value="Food">Food Items</option>
                <option value="HomeAppliances">Home Appliances</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Delivery Charge: ₹{deliveryCharge}</h3>
      
      {allFieldsFilled() && !isPaid && (
        <FilePayment 
          amount={deliveryCharge} 
          onSuccess={(paymentId) => { 
            setIsPaid(true); 
            setPaymentId(paymentId); 
            bookParcel(paymentId); 
          }} 
        />
      )}
      
      {isPaid && (<button onClick={downloadReceipt}>Download Receipt</button>)}
      <button onClick={() => bookParcel(paymentId)}>Confirm</button>
    </div>
  );
};

export default Book;
