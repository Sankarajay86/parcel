import React, { useEffect, useState } from "react";
import './Page.css';
import { dataRef } from '../firebase/firebaseconfig.js';
import { push, onValue } from 'firebase/database'; // Import the required methods
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function User() { 
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [allValue, setAllValue] = useState([]); // Initialize as an empty array
  const location = useLocation();
  const { displayName } = location.state || {}; 
  const navigate = useNavigate(); 
  // Function to handle the adding of name and displayName to Firebase
  const HandleAdd = () => {
    if (name !== "") {
      // Push both name and displayName as an object
      push(dataRef, { name, displayName,number });
      setName(""); // Reset the input field
      navigate('/Home');
    }
    
  };
  const handleInputChange = (e) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(/\D/g, "").slice(0, 10); // Keep only digits, limit to 10
    setNumber(sanitizedInput);
  };
  // useEffect to listen for changes in Firebase and update local state
  // useEffect(() => {
  //   const unsubscribe = onValue(dataRef, (snapshot) => { // Listen for changes
  //     const data = snapshot.val(); // Get the data from Firebase
  //     const getData = data ? Object.values(data) : []; // Handle case when no data exists
  //     setAllValue(getData); // Update state with data
  //   });

  //   return () => unsubscribe(); // Cleanup listener on component unmount
  // }, []);

  console.log(allValue); // Log all values from Firebase for debugging

  return (
    <>
      <div>
        {/* Form for user input */}
        <div className="form-container">
        <label htmlFor="name" className="label">Contact Us</label><br />
          <label htmlFor="name" className="label">Name</label><br />
          <input 
            value={name} 
            className="input-field"
            placeholder="Enter your name"  
            onChange={(e) => setName(e.target.value)} 
          /><br /><br />
          <label htmlFor="gmail" className="label">Gmail</label><br />
          <input 
            value={displayName} 
            className="input-field"
            placeholder="Enter your name"  
            onChange={(e) => setName(e.target.value)} 
          /><br />
          <label htmlFor="name" className="label">Number</label><br />
          <input
          id="phone-input"
          type="tel"
          value={number}
          className="input-field"
          placeholder="Enter your Phone Number"
          onChange={handleInputChange}
          ></input>
          
          <br></br><br />
          <button className="button" onClick={HandleAdd}>Submit</button>
        </div>
         {/* <ul>
            {allValue.map((item, index) => (
              <li key={index}>
                {item.name} - {item.displayName}
              </li>
            ))}
          </ul> */}
         {/*<p>Email: {displayName}</p> Display the email prop */}
      </div>
    </>
  );
}

export default User;
