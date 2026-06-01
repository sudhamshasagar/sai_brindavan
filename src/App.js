import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Values from './pages/Values';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import FAQ from './pages/FAQ';
import Footer from './components/Footer';
import AdminPortal from './pages/admin/AdminPortal';

import './App.css';

const PublicWebsite = () => {
  return (
    <>
      <Home />
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
    <Router basename="/sai_brindavan">
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicWebsite />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;