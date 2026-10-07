import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2, ShieldCheck } from "lucide-react";

import { auth } from "./firebase";

import Home from "./components/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import FAQ from "./pages/FAQ";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import DoctorAvailability from "./pages/DoctorAvailability";

import AdminPortal from "./pages/admin/AdminPortal";
import AdminLogin from "./pages/admin/AdminLogin";

import "./App.css";

/**
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
        <Navbar />

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

/**
 * =========================================================
 * ADMIN AUTHENTICATION LOADING
 * =========================================================
 */

const AdminAuthLoading = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
          <Loader2
            className="h-6 w-6 animate-spin text-[#1f9b90]"
            aria-hidden="true"
          />
        </div>

        <p className="mt-5 text-sm font-semibold text-[#1a365d]">
          Verifying secure access...
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Please wait while we check your administrator session.
        </p>
      </div>
    </div>
  );
};

/**
 * =========================================================
 * ADMIN ROUTE
 * =========================================================
 *
 * Firebase Authentication is the source of truth.
 *
 * No custom password or Firestore authentication is used.
 */

const AdminRoute = () => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return <AdminAuthLoading />;
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <AdminPortal />;
};

/**
 * =========================================================
 * APP
 * =========================================================
 */

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
        =================================================
        
        Authentication is required.
        
        Not authenticated:
          → AdminLogin
        
        Authenticated:
          → AdminPortal
        */}

        <Route
          path="/admin"
          element={<AdminRoute />}
        />

        {/* =================================================
            INDIVIDUAL BLOG ARTICLE
        ================================================= */}

        <Route
          path="/blogs/:slug"
          element={<BlogDetails />}
        />

        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;