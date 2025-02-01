import React, { useEffect, useState } from "react";
import './Page.css';
import { useNavigate } from 'react-router-dom';
import { dataRef } from '../firebase/firebaseconfig.js';
import { onValue } from 'firebase/database'; // Import the required Firebase method


function Page({ displayName }) {
  const [allValue, setAllValue] = useState([]); // State to store values from Firebase
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const navigate = useNavigate(); 
  const gmail = displayName;

  // Function to navigate to /Admin
  const goToAdmin = () => {
    navigate('/Admin'); // Navigate to the /Admin page
  };

  const goToHome = () => {
    navigate('/Home'); // Navigate to the /Admin page
  };

  // Function to navigate to /User
  const goToUser = () => {
    navigate('/User', { state: { displayName: gmail } }); // Navigate to the /User page
  };

  // useEffect to listen for changes in Firebase and update local state
  useEffect(() => {
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val(); // Get the data from Firebase
      const getData = data ? Object.values(data) : []; // Handle case when no data exists
      setAllValue(getData); // Update state with fetched data

      // Check if the logged-in user is an admin
      setIsAdmin(displayName === "sankarajay86@gmail.com");
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [displayName]); // Add displayName to the dependency array to update if it changes

  return (
    <div>
      {/* Conditionally render the button based on isAdmin state */}
      {isAdmin ? (
        <button onClick={goToAdmin}>Go to Admin</button>
      ) : (
        // Check if the displayName matches gmail
        allValue.map((item, index) => {
          if (item.displayName === gmail) {
            return <button key={index} onClick={goToHome}>Go to Home</button>;
          }
          return null; // Return null if the displayName doesn't match
        })
      )}
  
      {!isAdmin && !allValue.some(item => item.displayName === gmail) ? (
       <button onClick={goToUser}>Go to User</button>
      ) : (
        <p></p>
      )}
    </div>
  );
}
export default Page;
