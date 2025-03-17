import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataRef } from "../firebase/firebaseconfig.js";
import { onValue, off } from "firebase/database"; // Import Firebase methods
import "./Page.css"; // Import CSS file

function Page({ displayName }) {
  const [allValue, setAllValue] = useState([]); 
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const gmail = displayName;

  useEffect(() => {
    if (!displayName) return; // Avoid unnecessary operations

    const listener = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      const getData = data ? Object.values(data) : [];
      setAllValue(getData);
      setIsAdmin(displayName === "sankarajay86@gmail.com");
    });

    return () => off(dataRef); // Cleanup Firebase listener
  }, [displayName]);

  useEffect(() => {
    if (allValue.length === 0) return; // Ensure data is loaded before navigating
    
    if (isAdmin) {
      navigate("/Admin");
    } else if (allValue.some((item) => item.displayName === gmail)) {
      navigate("/Home", { state: { displayName: gmail } });
    }
  }, [isAdmin, allValue, gmail, navigate]);

  const goToUser = () => {
    navigate("/User", { state: { displayName: gmail } });
  };

  if (!displayName) return null; // Prevent rendering if displayName is missing

  return (
    <div>
      <button className="bold-text" onClick={goToUser}>Go to User</button>
    </div>
  );
}

export default Page;
