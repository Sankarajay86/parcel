// src/ParcelForm.js
import React, { useState } from 'react';

const ParcelForm = ({ onSubmit }) => {
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [parcelWeight, setParcelWeight] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!senderName || !recipientName || !parcelWeight || !address) {
      setError('All fields are required!');
      return;
    }

    const parcelData = {
      senderName,
      recipientName,
      parcelWeight,
      address,
    };

    onSubmit(parcelData);  // Pass the data to the parent component
    setError('');
    setSenderName('');
    setRecipientName('');
    setParcelWeight('');
    setAddress('');
  };

  return (
    <div className="parcel-form">
      <h2>Parcel Transport Service</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sender Name:</label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
        </div>
        <div>
          <label>Recipient Name:</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>
        <div>
          <label>Parcel Weight (kg):</label>
          <input
            type="number"
            value={parcelWeight}
            onChange={(e) => setParcelWeight(e.target.value)}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ParcelForm;
