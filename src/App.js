
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Home from './components/Home';
import Footer from './components/Footer';

import Values from './pages/Values';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import FAQ from './pages/FAQ';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';

import AdminPortal from './pages/admin/AdminPortal';
import DoctorAvailability from './pages/DoctorAvailability';

import './App.css';

const PublicWebsite = () => {
  return (
    <>
      <Home />
      {/* <Values /> */}
      {/* <AboutUs /> */}
      <Services />
      <Doctors />
      <DoctorAvailability />
      <Blogs />
      <FAQ />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router basename="/">
      <Routes>
        {/* Main Website */}
        <Route path="/" element={<PublicWebsite />} />

        {/* Doctors Directory */}
        <Route path="/doctors" element={<PublicWebsite />} />

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminPortal />} />

        {/* Availability */}
        <Route
          path="/availability"
          element={<DoctorAvailability />}
        />

        {/* Individual Sections */}
        <Route path="/services" element={<PublicWebsite />} />
        <Route path="/about" element={<PublicWebsite />} />
        <Route path="/blogs" element={<PublicWebsite />} />
        <Route path="/blogs/:slug" element={<BlogDetails />} />
        <Route path="/faq" element={<PublicWebsite />} />
      </Routes>
    </Router>
  );
}

export default App;

