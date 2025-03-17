import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Home.css";
import loc from "./img/loc.jpg";
import img1 from "./img/img1.png";
import din from "./img/din.jpg";
import karur from "./img/karur.jpg";
import erode from "./img/erode.png";
import suit from "./img/suit.png";
import suit1 from "./img/suit1.png";
import { db } from "../firebase/firebaseconfig.js";
import { collection, getDocs } from "firebase/firestore";
import Order from './orders.jsx'
function Home() {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const imagePaths = [erode, din, karur];
  const imgsuit = [suit, suit1];
  const location = useLocation();
  const displayName = location.state?.displayName || "Guest";
  const [userOrder, setUserOrder] = useState(null); 
 const [orders, setOrders] = useState([]);

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "parcelBookings"));
      const ordersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Filter orders only if displayName is available
      if (displayName && displayName !== "Guest") {
        const userOrders = ordersList.filter(order => order.senderName === displayName);
        setOrders(userOrders);
      } else {
        setOrders([]); // No orders for "Guest"
      }
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  fetchOrders();
}, [displayName, db]); // Added db to dependencies


  return (
    <>
      <div className="home-container" style={{ marginRight: "3rem", height: "100vh", width: "100vw" }}>
        {/* Header */}
        <header className="header11">
          <div className="container11">
            <nav className="navbar11">
              <span className="logo-text">Sri Ganga Parcel Service</span>
              <ul className="navbar-list1">
                <li><button className="navbar-link1" >
                <a href={`/serach?displayName=${encodeURIComponent(displayName)}`} className="navbar-link1">
                Book
              </a></button>


                  
                </li>
                <li>
                <button className="navbar-link1" >
                  <a href="#footer1" className="navbar-link1">
                    Contact
                  </a></button>
                </li>
                <li>
                  <button className="navbar-link1" onClick={() => setShowOrderPopup(true)}>
                    Order
                  </button>
                </li>
                <li>
                  <button className="navbar-link1" onClick={() => setShowProfilePopup(true)}>
                    Profile
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Profile Popup */}
        {showProfilePopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>User Profile</h3>
              <h1>Welcome, {displayName}</h1>
              <button className="close-btn" onClick={() => setShowProfilePopup(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Order Popup */}
        {showOrderPopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>Order Details</h3>
          <Order displayName={displayName}></Order>  
          <button className="close-btn" onClick={() => setShowOrderPopup(false)}>
                Close
              </button>
    </div>
  </div>
)}


        {/* Main Content */}
        <main className="main">
          {/* Features Section */}
          <div className="container2">
            <section className="section1-features1">
              <div className="container1">
                <p className="section-subtitle2">Features</p>
                <h2 className="h2-section-title2">What We Provide</h2>
                <ul className="features-list2">
                  <li>
                    <div className="feature-card2">
                      <div className="card-icon2">
                        <img
                          src="https://5.imimg.com/data5/SELLER/Default/2022/12/AV/FD/QS/33594867/overnight-delivery-courier-service-500x500.png"
                          className="img1"
                          alt="Safe & Secure"
                        />
                      </div>
                      <h3 className="h3-card-title2">Safe & Secure</h3>
                      <p className="card-text2">We provide top-notch security for your goods throughout the transportation process.</p>
                    </div>
                  </li>
                  <li>
                    <div className="feature-card2">
                      <div className="card-icon2">
                        <img src={loc} className="img1" alt="Multiple Locations" />
                      </div>
                      <h3 className="h3-card-title2">Multiple Locations</h3>
                      <p className="card-text2">We provide multiple drop-off and pickup locations so you don't have to worry.</p>
                    </div>
                  </li>
                  <li>
                    <div className="feature-card2">
                      <div className="card-icon2">
                        <img src={img1} className="img1" alt="Tracking Made Easy" />
                      </div>
                      <h3 className="h3-card-title2">Tracking Made Easy</h3>
                      <p className="card-text2">A tracking number for the entire process, so you can find the exact position.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          {/* Projects Section */}
          <section className="section-project1" id="projects">
            <div className="container1">
              <p className="section-subtitle1">Projects</p>
              <h2 className="h2-section-title1">Featured Projects</h2>
              <ul className="project-list1">
                {imagePaths.map((img, index) => (
                  <li className="project-item1" key={index}>
                    <div className="project-card1">
                      <figure className="card-banner1 img-holder">
                        <img src={img} className="img-cover2" alt={`Project ${index + 1}`} />
                      </figure>
                      <div className="card-content1">
                        <p className="card-tag1">
                          {["Erode", "Dindigul", "Karur"][index]}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer1" id="footer1">
          <div className="container10">
            <div className="footer-top section1">
              <div className="footer-brand1">
                <Link to="/" className="logo1">GPS</Link>
                <p className="footer-text1">Many desktop publishing packages use Lorem Ipsum as default.</p>
              </div>
              <ul className="footer-list1">
                <li>
                  <Link to="/about" className="footer-link1">About</Link>
                </li>
                <li>
                  <Link to="/services" className="footer-link1">Services</Link>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
