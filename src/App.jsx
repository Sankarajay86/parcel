import React, { useState } from 'react';
import './App.css';
import Gmail from './component1/Gmail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './component1/Admin';
import Page from './component1/Page';
import User from './component1/User';
import Home from './component1/Home';
import Book from './component1/Book';
import SearchBox from './component1/SearchBox';
import Blog from './component1/blog.jsx'
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
        <Route path="/book" element={<Book />}/>
        <Route path="/serach" element={<SearchBox />}/>
        <Route path="/blog" element={<Blog />}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
