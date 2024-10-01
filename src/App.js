import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Footer from './components/Footer';
import Heartrate from './components/Heartrate';

function App() {
  return (
    <>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path='/' exact />
        </Routes>
        <Heartrate></Heartrate>
        <Footer></Footer>
      </Router>
    </>
    
  );
}

export default App;
