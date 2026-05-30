import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './App.css'; 
import Values from './pages/Values';
import ContactBar from './components/ContactBar';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import FAQ from './pages/FAQ';
import Footer from './components/Footer';
import AdminPortal from './pages/admin/AdminPortal';

// We group all the public-facing sections into one component
const PublicWebsite = () => {
  return (
    <>
      <Home />
      {/* <ContactBar /> */}
      <Values />
      <AboutUs />
      <Services />
      <Doctors />
      <FAQ />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route 1: The Main Public Website */}
          <Route path="/" element={<PublicWebsite />} />
 
          {/* Route 2: The HR / Admin Portal Page */}
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;