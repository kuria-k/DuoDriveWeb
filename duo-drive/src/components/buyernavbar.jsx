import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaCar,
  FaTachometerAlt,
  FaHeart,
  FaHistory,
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaTimes,
  FaBookOpen,
  FaPhone,
} from "react-icons/fa";
import { Menu, X } from "lucide-react";

const jungleGreen = "#2fa88a";

const navItems = [
  { path: "/buyer/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { path: "/buyer/inventory", label: "Inventory", icon: FaCar },
  { path: "/buyer/favourites", label: "Favourites", icon: FaHeart },
  { path: "/buyer/history", label: "History", icon: FaHistory },
  { path: "/buyer/tips", label: "Tips & Guide", icon: FaBookOpen },
  { path: "/buyer/contact", label: "Contact", icon: FaPhone },
  { path: "/buyer/profile", label: "Profile", icon: FaUser },
];

const BuyerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [initials, setInitials] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      const parts = name.trim().split(" ");
      const userInitials =
        parts.length === 1
          ? parts[0][0].toUpperCase()
          : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      setInitials(userInitials);
    }
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <>
     <nav id="buyer-navbar" className="w-full backdrop-blur-xl bg-black/80 border-b border-white/10">
  {/* ================= TOP GREETING BAR ================= */}
<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex justify-between items-center h-12 text-white/90 text-sm">
    <div className="flex items-center space-x-4">
      <span className="flex items-center space-x-2 text-lg font-medium">
  

  {/* Greeting text */}
  <span className="text-gray-200">
    Hello,
    <span
      className="ml-1 font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent hover:from-teal-400 hover:to-green-500 transition-all duration-300"
    >
      {localStorage.getItem("userName") || "User"}
    </span>
  </span>
</span>

    </div>
     {/* ------------------ Branding ------------------ */}
      <div className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center space-x-1">
        <span className="text-white">Duo</span>
        <span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent">
          Drive
        </span>
        <span className="text-white">Kenya</span>
      </div>
      
    <div className="hidden sm:flex space-x-6">
      <span>📞 +254 700 123 456</span>
      <span>📍 Nairobi, Kenya</span>
    </div>
  </div>
</div>


  {/* ================= MAIN NAVBAR ================= */}
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16 border-t border-white/10">

      {/* ------------------ Desktop Nav ------------------ */}
      <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group relative flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-[#2fa88a] bg-[#2fa88a]/10"
                  : "text-white/80 hover:text-[#2fa88a] hover:bg-white/5"
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap">{label}</span>
          </NavLink>
        ))}
      </div>

      {/* ------------------ User + Hamburger ------------------ */}
      <div className="flex items-center space-x-4">
        {/* User Avatar */}
        {initials && (
          <div className="w-10 h-10 flex items-center justify-center rounded-full 
                          bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] text-white font-bold text-sm shadow-lg">
            {initials}
          </div>
        )}

        {/* Logout button desktop */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                     text-white/80 hover:text-red-400 hover:bg-white/5 transition-all duration-200"
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </button>

        {/* Hamburger mobile */}
        <button
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </div>
  </div>

  {/* ================= MOBILE MENU ================= */}
  {menuOpen && (
    <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-[#2fa88a] bg-[#2fa88a]/10"
                  : "text-white/80 hover:text-[#2fa88a] hover:bg-white/5"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}

        {/* Logout Button Mobile */}
        <button
          onClick={() => {
            setMenuOpen(false);
            setShowLogoutModal(true);
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-red-400 hover:bg-white/5 transition-all duration-200 mt-4 border-t border-white/10 pt-6"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )}

  {/* ================= LOGOUT MODAL ================= */}
  {showLogoutModal && (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="relative rounded-2xl p-8 max-w-md w-full shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-black">Confirm Logout</h2>
          <button
            onClick={() => setShowLogoutModal(false)}
            className="text-gray-400 hover:text-black transition p-1 hover:bg-gray-100 rounded-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-700 mb-8 text-base">
          Are you sure you want to logout?
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
            style={{ backgroundColor: "#1f7a63" }}
          >
            Yes, Logout
          </button>
          <button
            onClick={() => setShowLogoutModal(false)}
            className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
</nav>


      {/* Logout Confirmation Modal */}
{showLogoutModal && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50 px-4"
    style={{
      backgroundColor: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(8px)",
    }}
  >
    <div
      className="relative rounded-2xl p-8 max-w-md w-full shadow-2xl"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.5)",
      }}
    >
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-black">Confirm Logout</h2>
        <button
          onClick={() => setShowLogoutModal(false)}
          className="text-gray-400 hover:text-black transition p-1 hover:bg-gray-100 rounded-lg"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <p className="text-gray-700 mb-8 text-base">
        Are you sure you want to logout?
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
          style={{ backgroundColor: jungleGreen }}
        >
          Yes, Logout
        </button>
        <button
          onClick={() => setShowLogoutModal(false)}
          className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </>
  );
};

export default BuyerNavbar;