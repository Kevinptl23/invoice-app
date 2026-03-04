import viteLogo from '/vite.svg'
import './App.css'
import { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import InvoiceDetails from './pages/InvoiceDetails.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <h1 className='text-2xl text-blue-400'>Hello from frontend..</h1>
      <Routes>
        <Route path="/invoices/:id" element={<InvoiceDetails />} />
      </Routes>
    </>
  )
}

export default App;
