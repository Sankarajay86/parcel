import React from "react";

const FilePayment = ({ amount, onSuccess }) => {
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const handlePayment = () => {
    loadRazorpay();

    const options = {
      key: "rzp_live_OQkmrxZ01dqYGr", // Replace with your Razorpay API Key
      amount: amount * 100, // Razorpay accepts amount in paise
      currency: "INR",
      name: "GPS-Service",
      description: "Payment for Parcel Booking",
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        onSuccess();
      },
      prefill: {
        name: "Sankar Ajay",
        email: "sankarajay86.com",
        contact: "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <button onClick={handlePayment}>Pay ₹{amount}</button>
  );
};

export default FilePayment;
