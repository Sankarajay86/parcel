import React, { useState } from 'react';
import './App.css';
import Gmail from './component1/Gmail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './component1/Admin';
import Page from './component1/Page';
import User from './component1/User';
import Home from './component1/Home';
function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" index element={<Gmail />} />
        <Route path="/Page" element={<Page />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/User" element={<User />}/>
        <Route path="/Home" element={<Home />}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
