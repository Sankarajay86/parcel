import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig.js";
import { collection, getDocs } from "firebase/firestore";

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "parcelBookings"));
        const ordersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h1>All Parcel Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Sender Name</th>
            <th>Sender Phone</th>
            <th>Pickup Address</th>
            <th>Receiver Name</th>
            <th>Receiver Phone</th>
            <th>Delivery Address</th>
            <th>Weight (kg)</th>
            <th>Item Type</th>
            <th>Delivery Charge (₹)</th>
            <th>Payment ID</th>
            <th>From City</th>
            <th>To City</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.bookingId}</td>
              <td>{order.senderName}</td>
              <td>{order.senderPhone}</td>
              <td>{order.pickupAddress}</td>
              <td>{order.receiverName}</td>
              <td>{order.receiverPhone}</td>
              <td>{order.deliveryAddress}</td>
              <td>{order.weight} kg</td>
              <td>{order.itemType}</td>
              <td>₹{order.deliveryCharge}</td>
              <td>{order.paymentId || "Not Paid"}</td>
              <td>{order.fromLocation}</td>
              <td>{order.toLocation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
