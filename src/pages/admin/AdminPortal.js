import React from "react";
import Navbar from "../../components/Navbar";
import DoctorsAdmin from "./DoctorsAdmin";

const AdminPortal = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <DoctorsAdmin />
    </div>
  );
};

export default AdminPortal;