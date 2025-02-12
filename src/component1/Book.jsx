import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig.js";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./sty.css";
import "./Book.css";
import { useLocation } from "react-router-dom";
import FilePayment from './FilePayment.jsx';

const Book = () => {
  const location = useLocation();
  const fromLocation = location.state?.from || "";
  const toLocation = location.state?.to || "";

  const [weight, setWeight] = useState(0);
  const [distance, setDistance] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  // Distance Matrix
  const distanceMatrix = {
    "Sivakasi-Karur": 150,
    "Sivakasi-Dindigul": 100,
    "Sivakasi-Erode": 200,
    "Karur-Dindigul": 85,
    "Karur-Erode": 120,
    "Dindigul-Erode": 180,
  };

  // Rate Constants
  const baseFee = 50;
  const weightRate = 10;
  const distanceRate = 5;

  // Calculate Distance
  useEffect(() => {
    if (fromLocation && toLocation && fromLocation !== toLocation) {
      const key = `${fromLocation}-${toLocation}`;
      const reverseKey = `${toLocation}-${fromLocation}`;
      const calculatedDistance = distanceMatrix[key] || distanceMatrix[reverseKey] || 0;
      setDistance(calculatedDistance);
    } else {
      setDistance(0);
    }
  }, [fromLocation, toLocation]);

  // Calculate Delivery Charge
  useEffect(() => {
    if (weight > 0 && distance > 0) {
      const totalCharge = baseFee + weight * weightRate + distance * distanceRate;
      setDeliveryCharge(totalCharge);
    } else {
      setDeliveryCharge(0);
    }
  }, [weight, distance]);

  // Booking Details State
  const [bookingDetails, setBookingDetails] = useState({
    senderName: "",
    senderPhone: "",
    pickupAddress: "",
    receiverName: "",
    receiverPhone: "",
    deliveryAddress: "",
    itemType: "Documents",
    insurance: "",
  });

  const [bookingId, setBookingId] = useState(null);

  // Input Handler
  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  // Book Parcel and Store in Firestore
  const bookParcel = async (paymentId) => {
    try {
      const docRef = await addDoc(collection(db, "parcelBookings"), {
        ...bookingDetails,
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

  // Download Receipt
  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Parcel Booking Receipt", 105, 10, { align: "center" });

    const tableData = Object.entries({ 
      ...bookingDetails, 
      BookingID: bookingId, 
      Distance: distance, 
      Weight: weight, 
      DeliveryCharge: deliveryCharge,
      PaymentID: paymentId 
    });
    
    doc.autoTable({ head: [["Field", "Details"]], body: tableData, startY: 20 });
    doc.save("Parcel_Receipt.pdf");
  };

  // Check if all inputs are filled
  const allFieldsFilled = () => {
    return Object.values(bookingDetails).every((field) => field) && weight > 0;
  };

  return (
    <div className="container111">
      <h1>Parcel Booking</h1>
      <table className="booking-table">
        <tbody>
          <tr>
            <td>From:</td>
            <td> {fromLocation}</td>
          </tr>
          <tr>
            <td>To</td>
            <td> {toLocation}</td>
          </tr>
          <tr>
            <td>Sender Name:</td>
            <td>
              <input
                type="text"
                name="senderName"
                placeholder="Sender Name"
                value={bookingDetails.senderName}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>Sender Phone:</td>
            <td>
              <input
                type="text"
                name="senderPhone"
                placeholder="Sender Phone"
                value={bookingDetails.senderPhone}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>Pickup Address:</td>
            <td>
              <input
                type="text"
                name="pickupAddress"
                placeholder="Pickup Address"
                value={bookingDetails.pickupAddress}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>Receiver Name:</td>
            <td>
              <input
                type="text"
                name="receiverName"
                placeholder="Receiver Name"
                value={bookingDetails.receiverName}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>Receiver Phone:</td>
            <td>
              <input
                type="text"
                name="receiverPhone"
                placeholder="Receiver Phone"
                value={bookingDetails.receiverPhone}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>Delivery Address:</td>
            <td>
              <input
                type="text"
                name="deliveryAddress"
                placeholder="Delivery Address"
                value={bookingDetails.deliveryAddress}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>Weight (kg):</td>
            <td>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                placeholder="Enter Weight"
              />
            </td>
          </tr>
          <tr>
            <td>Item Type:</td>
            <td>
              <select
                name="itemType"
                value={bookingDetails.itemType}
                onChange={handleChange}
              >
                <option value="Documents">Documents</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothes">Clothes</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Insurance:</td>
            <td>
              <input
                type="text"
                name="insurance"
                placeholder="Insurance"
                value={bookingDetails.insurance}
                onChange={handleChange}
              />
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

      {isPaid && (
        <button onClick={downloadReceipt}>Download Receipt</button>
      )}
    </div>
  );
};

export default Book;
