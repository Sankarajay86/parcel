import './Dashboard.css';
import { dataRef } from '../firebase/firebaseconfig.js';
import { onValue } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Vehicles from './Vechile.jsx';
import Order from './order.jsx';
import { db } from "../firebase/firebaseconfig.js";
import { collection, getDocs } from "firebase/firestore";
const Dashboard = () => {
   const [allValue, setAllValue] = useState([]); 
   const [totalOrders, setTotalOrders] = useState(0);
   const navigate = useNavigate(); 
      useEffect(() => {
          const unsubscribe = onValue(dataRef, (snapshot) => { 
              const data = snapshot.val(); 
              const getData = data ? Object.values(data) : []; 
              setAllValue(getData);
          });
      
          return () => unsubscribe(); 
      }, []);
  const [view, setView] = useState('dashboard'); 
  const logout = () => {
    navigate('/'); 
  };

  const totalUsers = allValue.length;
   const activeUsers = allValue.filter(user => user.isActive).length;
    const userPercentage = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0;
    
    useEffect(() => { const fetchOrders = async () => { try { const ordersCollection = collection(db, 'parcelBookings'); 
      const snapshot = await getDocs(ordersCollection); setTotalOrders(snapshot.size); } catch (error) { console.error("Error fetching orders: ", error); } }; 
      fetchOrders(); }, []);

  return (
    <div className="container"
    style={{
      backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/249/386/337/digital-art-geometry-texture-black-wallpaper-preview.jpg')",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      height: '100vh', 
      width: '100%', 
      display:'flex',
      marginBottom:'40%'

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
          <div> <h1>Dashboard</h1>
            <div className="insights">
           <div className="insights">
               <div className="stats-card"> <h3>Total Users</h3> <h1>{totalUsers-2}</h1> </div> <div className="stats-card"> <h3>Active Users</h3> <h1>{activeUsers}</h1> </div> <div className="stats-card"> <h3>Active User Percentage</h3> <h1>{userPercentage}%</h1> </div> </div>
               <br></br>
               <div className="stats-card">
               <h3>Total Orders</h3>
               <h1>{totalOrders}</h1>
               </div>
            </div>
          </div>
        )}

        {view === 'customers' && (
          <div>
            <h1>Customers</h1>
          
          <div className="insights">            
            <div className="user-list">
                {allValue.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden" style={{
                      color:"black"
                    }}>
                    <thead>
                      <tr className="bg-blue-500 text-black text-left text-sm sm:text-base">
                        <th className="p-3 border-b">Name</th>
                        <th className="p-3 border-b">Email</th>
                        <th className="p-3 border-b">Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allValue.slice(2).map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-100 transition duration-200 text-sm sm:text-base"
                        >
                          <td className="p-3 border-b border-gray-200">{item.name}</td>
                          <td className="p-3 border-b border-gray-200">{item.displayName}</td>
                          <td className="p-3 border-b border-gray-200">{item.number}</td>
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
