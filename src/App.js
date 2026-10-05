
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./components/Home";
import Footer from "./components/Footer";

import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import FAQ from "./pages/FAQ";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";

import AdminPortal from "./pages/admin/AdminPortal";
import DoctorAvailability from "./pages/DoctorAvailability";

import "./App.css";
import Navbar from "./components/Navbar";

/*
 * =========================================================
 * PUBLIC WEBSITE
 * =========================================================
 *
 * This remains a SINGLE-PAGE website.
 *
 * All public sections are rendered together:
 *
 * Home
 * Services
 * Doctors
 * Availability
 * Blogs
 * FAQ
 *
 * Navbar navigation scrolls to these sections.
 */

const PublicWebsite = () => {
  return (
    <div className="landing-page-container">
      <main className="landing-main-content">
        <Navbar/>
        <Home />

        {/* Optional sections */}
        {/* <Values /> */}
        {/* <AboutUs /> */}

        <Services />
        <Doctors />
        <DoctorAvailability />
        <Blogs />
        <FAQ />

      </main>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router basename="/">
      <Routes>

        {/* =================================================
            MAIN ONE-PAGE WEBSITE
        ================================================= */}

        <Route
          path="/"
          element={<PublicWebsite />}
        />

        {/* =================================================
            ADMIN
           
            Separate application area.
        ================================================= */}

        <Route
          path="/admin"
          element={<AdminPortal />}
        />

        {/* =================================================
            INDIVIDUAL BLOG ARTICLE
           
            Blog details is a legitimate separate URL.
        ================================================= */}

        <Route
          path="/blogs/:slug"
          element={<BlogDetails />}
        />

      </Routes>
    </Router>
  );
}

export default App;
