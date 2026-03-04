import viteLogo from '/vite.svg'
import './App.css'
import { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import InvoiceDetails from './pages/InvoiceDetails.jsx';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/invoices/:id" element={<InvoiceDetails />} />
      </Routes>
    </>
  )
}

export default App;
