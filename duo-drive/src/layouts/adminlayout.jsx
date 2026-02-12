import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/adminsidebar";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
  const role = sessionStorage.getItem("role");
  const isSuperuser = sessionStorage.getItem("isSuperuser");

  if (role !== "admin" && isSuperuser !== "true") {
    navigate("/login", { replace: true });
  }



    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Clear session
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("isSuperuser");
        sessionStorage.removeItem("authToken");
        setShowModal(true);
      }, 1000 * 13600 * 60); 
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [navigate]);

  const handleRedirect = () => {
    setShowModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex">
      {/* Sidebar fixed on the left */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content area shifts depending on sidebar width */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        } w-full`}
      >
        <Outlet />
      </div>

      {/* Session timeout modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white text-center">
            <h2 className="text-3xl font-extrabold text-green-800 mb-4">
              Session Expired
            </h2>
            <p className="text-black mb-6">
              You have been inactive for{" "}
              <span className="font-semibold text-green-700">1 minute</span>.
              Please log in again.
            </p>
            <div className="w-16 h-1 bg-green-700 mx-auto mb-6 rounded-full"></div>
            <button
              onClick={handleRedirect}
              className="bg-green-700 hover:bg-green-900 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              Re‑Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;

