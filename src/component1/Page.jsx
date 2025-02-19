import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataRef } from "../firebase/firebaseconfig.js";
import { onValue } from "firebase/database"; // Import the required Firebase method
import "./Page.css"; // Import CSS file

function Page({ displayName }) {
  const [allValue, setAllValue] = useState([]); // State to store values from Firebase
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const navigate = useNavigate();
  const gmail = displayName;

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

  useEffect(() => {
    if (isAdmin) {
      navigate("/Admin");
    } else if (allValue.some((item) => item.displayName === gmail)) {
      navigate("/Home");
    }
  }, [isAdmin, allValue, gmail, navigate]);

  const goToUser = () => {
    navigate("/User", { state: { displayName: gmail } });
  };

  return <div>
    <button className="bold-text" onClick={goToUser}>Go to User</button>
  </div>;
}

export default Page;