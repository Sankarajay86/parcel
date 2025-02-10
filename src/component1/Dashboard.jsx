import './Dashboard.css';
import './constants/recent-order-data';
import './constants/update-data';
import './constants/sales-analytics-data';
import './constants/style.css';
import { dataRef } from '../firebase/firebaseconfig.js';
import { onValue } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Vehicles from './Vechile.jsx';
import Order from './order.jsx';
import "./vechile.css";
const Dashboard = () => {
   const [allValue, setAllValue] = useState([]); 
   const navigate = useNavigate(); 
      useEffect(() => {
          const unsubscribe = onValue(dataRef, (snapshot) => { // Listen for changes
              const data = snapshot.val(); // Get the data from Firebase
              const getData = data ? Object.values(data) : []; // Handle case when no data exists
              setAllValue(getData); // Update state with data
          });
      
          return () => unsubscribe(); // Cleanup listener on component unmount
      }, []);
  const [view, setView] = useState('dashboard'); // State to toggle between dashboard and customers view
  const logout = () => {
    navigate('/'); // Navigate to the /Admin page
  };


  return (
    <div className="container"
    style={{
      backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/249/386/337/digital-art-geometry-texture-black-wallpaper-preview.jpg')",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      height: '100vh', // Full viewport height
      width: '100vw', // Full viewport width
    }}
    >
      <aside>
        <div className="sidebar">
          <a
            href="#"
            className={view === 'dashboard' ? 'active' : ''}
            onClick={() => setView('dashboard')}
          >
            <h3>Dashboard</h3>
          </a>
          <a
            href="#"
            className={view === 'customers' ? 'active' : ''}
            onClick={() => setView('customers')}
          >
            <h3>Customers</h3>
          </a>
          <a href="#"
            className={view === 'order' ? 'active' : ''}
            onClick={() => setView('order')}>
            <h3>Orders</h3>
          </a>
          <a href="#">
            <h3>Reports</h3>
          </a>
          <a href="#"
          className={view === 'add' ? 'active' : ''}
          onClick={() => setView('add')}
          >
            <h3>Vechicle</h3>
          </a>
          <a href="#" onClick={logout}>
            <h3>Logout</h3>
          </a>
        </div>
      </aside>

      <main>
        {view === 'dashboard' && (
          <div>
            <h1>Dashboard</h1>
            <div className="insights">
              <div className="sales">
                <span className="material-icons-sharp">analytics</span>
                <div className="middle">
                  <div className="left">
                    <h3>Total Sales</h3>
                    <h1>$25,024</h1>
                  </div>
                  <div className="progress">
                    <svg>
                      <circle cx="38" cy="38" r="36"></circle>
                    </svg>
                    <div className="number">
                      <p>81%</p>
                    </div>
                  </div>
                </div>
                <small className="text-muted">Last 24 hours</small>
              </div>
              {/* Add more insights sections here */}
            </div>
          </div>
        )}

        {view === 'customers' && (
          <div>
            <h1>Customers</h1>
          
          <div className="insights">            
            <div className="user-list">
                {allValue.length > 0 ? (
                    <table className='custom-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Number</th>
                            </tr>
                        </thead>
                        <tbody>
                        {allValue.slice(2).map((item, index) => (
                         <tr key={index}>
                         <td>{item.name}</td>
                        <td>{item.displayName}</td>
                        <td>{item.number}</td>
                        </tr>
                         ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading users...</p>
                    
                )}
                </div>
          </div>
          </div>
        )}
        {view === 'add' && (
          <div>
            <h1>Vechiles</h1>
          <div className="insights">            
            <div className="user-list">
            <Vehicles></Vehicles>
                </div>
          </div>
          </div>
        )}
        {view === 'order' && (
          <div>
            <p>Orders</p>
            <Order></Order> 
          </div>
        )}
      </main>

      
    </div>
  );
};

export default Dashboard;
