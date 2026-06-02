import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Footer from './components/Footer';

import Values from './pages/Values';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import FAQ from './pages/FAQ';

import AdminPortal from './pages/admin/AdminPortal';

import './App.css';
import DoctorAvailability from './pages/DoctorAvailability';

/* Landing Page */
const PublicWebsite = () => {
  return (
    <>
      <Home />
      {/* Uncomment when ready */}
      {/* <Values /> */}
      {/* <AboutUs /> */}

      <Services />
      <Doctors />
      <DoctorAvailability/>
      <FAQ />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Main Website */}
        <Route path="/" element={<PublicWebsite />} />

        {/* Dedicated Doctors Directory */}
        <Route path="/doctors" element={<Doctors />} />

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/availability" element={<DoctorAvailability/>}/>

        {/* Future Routes */}
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />

      </Routes>
    </Router>
  );
}

export default App;