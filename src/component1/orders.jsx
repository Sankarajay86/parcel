import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseconfig.js";
import { collection, query, where, getDocs } from "firebase/firestore";

function Orderdetails({ displayName, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (displayName === "Guest") {
        setOrders([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const q = query(collection(db, "parcelBookings"), where("displayName", "==", displayName));
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (err) {
        console.error("Error fetching orders: ", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [displayName]);

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>Order Details</h3>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Sender</th>
                <th>Phone</th>
                <th>Pickup Address</th>
                <th>Receiver</th>
                <th>Receiver Phone</th>
                <th>Delivery Address</th>
                <th>Weight</th>
                <th>Item Type</th>
                <th>Charge</th>
                <th>Payment</th>
                <th>From</th>
                <th>To</th>
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
        ) : (
          <p>No orders found for {displayName}.</p>
        )}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Orderdetails;
