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
  FaCalculator,
  FaQuestionCircle,
} from "react-icons/fa";
import { Menu, X } from "lucide-react";

const jungleGreen = "#2fa88a";

const navItems = [
  { path: "/buyer/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { path: "/buyer/inventory", label: "Inventory", icon: FaCar },
  { path: "/buyer/favourites", label: "Favourites", icon: FaHeart },
  { path: "/buyer/history", label: "History", icon: FaHistory },
  { path: "/buyer/financing", label: "Financing Calculator", icon: FaCalculator },
  { path: "/buyer/tips", label: "Tips & Guide", icon: FaBookOpen },
  { path: "/buyer/contact", label: "Contact", icon: FaPhone },
  { path: "/buyer/profile", label: "Profile", icon: FaUser }, 
  { path: "/buyer/faq", label: "FAQ", icon: FaQuestionCircle },
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

  // const handleLogout = () => {
  //   setShowLogoutModal(false);
  //   localStorage.removeItem("role");
  //   localStorage.removeItem("userName");
  //   navigate("/login");
  // };
  // In your logout handler (wherever it is)
const handleLogout = () => {
  localStorage.removeItem("role");
  localStorage.removeItem("authToken");
  // Remove any other stored user data
  navigate("/login", { replace: true });
};

  return (
    <>
      <nav className="w-full backdrop-blur-xl bg-black/80 border-b border-white/10 shadow-lg">
        {/* ========== TOP GREETING BAR ========== */}
        <div className="max-w-[2600px] mx-auto px-7 sm:px-9 lg:px-11">
          <div className="flex justify-between items-center h-14 text-white/90 text-sm">
            <div className="flex items-center space-x-4 text-2xl">
              <span className="text-gray-200">
                Hello,
                <span className="ml-1 font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent hover:from-teal-400 hover:to-green-500 transition-all duration-300">
                  {localStorage.getItem("userName") || "User"}
                </span>
              </span>
            </div>

            {/* Branding */}
            <div className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center space-x-1">
              <span className="text-white">Duo</span>
              <span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent">
                Drive
              </span>
              <span className="text-white">Kenya</span>
            </div>

            {/* Contact info (hidden on mobile) */}
            <div className="hidden sm:flex space-x-6 text-gray-200">
              <span>📞 +254 706 193 959</span>
              <span>📍 Nairobi, Kenya</span>
            </div>
          </div>
        </div>

        {/* ========== MAIN NAVBAR ========== */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-16 border-t border-white/10">

          <div>
            {initials && (
                <div className="w-10 h-10 flex items-center justify-center rounded-full 
                                bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] text-white font-bold text-sm shadow-md">
                  {initials}
                </div>
              )}
          </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center space-x-3">
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-[#2fa88a] bg-[#2fa88a]/10"
                        : "text-white/80 hover:text-[#2fa88a] hover:bg-white/5"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </NavLink>
              ))}
            </div>

            {/* User avatar + hamburger */}
            <div className="flex items-center space-x-4">
              

              <button
                onClick={() => setShowLogoutModal(true)}
                className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                           text-white/80 hover:text-red-400 hover:bg-white/5 transition-all duration-200"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>

              {/* Mobile hamburger */}
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

        {/* ========== MOBILE MENU ========== */}
        {menuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-3">
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
      </nav>

      {/* ========== LOGOUT MODAL ========== */}
      
{showLogoutModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 px-4 min-h-screen bg-black/50 backdrop-blur-sm">
    <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Confirm Logout</h2>
        <button
          onClick={() => setShowLogoutModal(false)}
          className="text-white/70 hover:text-white transition p-1 rounded-lg"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Message */}
      <p className="text-white/80 mb-6 text-base">
        Are you sure you want to logout?
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="flex-1 py-3 rounded-lg font-semibold text-white shadow-md bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] hover:opacity-90 transition"
        >
          Yes, Logout
        </button>
        <button
          onClick={() => setShowLogoutModal(false)}
          className="flex-1 py-3 rounded-lg font-semibold text-white bg-white/30 backdrop-blur-md hover:bg-white/20 transition"
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


// import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaCar,
//   FaTachometerAlt,
//   FaHeart,
//   FaHistory,
//   FaUser,
//   FaSignOutAlt,
//   FaTimes,
//   FaBookOpen,
//   FaPhone,
// } from "react-icons/fa";
// import { Menu, X } from "lucide-react";

// const navItems = [
//   { path: "/buyer/dashboard", label: "Dashboard", icon: FaTachometerAlt },
//   { path: "/buyer/inventory", label: "Inventory", icon: FaCar },
//   { path: "/buyer/favourites", label: "Favourites", icon: FaHeart },
//   { path: "/buyer/history", label: "History", icon: FaHistory },
//   { path: "/buyer/tips", label: "Tips & Guide", icon: FaBookOpen },
//   { path: "/buyer/contact", label: "Contact", icon: FaPhone },
//   { path: "/buyer/profile", label: "Profile", icon: FaUser },
// ];

// const BuyerNavbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [initials, setInitials] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const name = localStorage.getItem("userName");
//     if (name) {
//       const parts = name.trim().split(" ");
//       const userInitials =
//         parts.length === 1
//           ? parts[0][0].toUpperCase()
//           : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
//       setInitials(userInitials);
//     }
//   }, []);

//   const handleLogout = () => {
//     setShowLogoutModal(false);
//     localStorage.removeItem("role");
//     localStorage.removeItem("userName");
//     navigate("/login");
//   };

//   return (
//     <>
//       <nav className="w-full backdrop-blur-xl bg-black/80 border-b border-white/10 shadow-lg">
//         {/* ====== TOP BAR ====== */}
//         <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-10">
//           <div className="flex justify-between items-center h-14 text-white/90 text-sm">
//             {/* Greeting */}
//             <div className="flex items-center space-x-2">
//               <span className="text-gray-200">
//                 Hello,
//                 <span className="ml-1 font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
//                   {localStorage.getItem("userName") || "User"}
//                 </span>
//               </span>
//             </div>

//             {/* Contact info */}
//             <div className="hidden sm:flex space-x-6 text-gray-200">
//               <span>📞 +254 700 123 456</span>
//               <span>📍 Nairobi, Kenya</span>
//             </div>

//             {/* Avatar + Logout */}
//             <div className="flex items-center space-x-4">
//               {initials && (
//                 <div className="w-10 h-10 flex items-center justify-center rounded-full 
//                                 bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] text-white font-bold text-sm shadow-md">
//                   {initials}
//                 </div>
//               )}
//               <button
//                 onClick={() => setShowLogoutModal(true)}
//                 className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
//                            text-white/80 hover:text-red-400 hover:bg-white/5 transition-all duration-200"
//               >
//                 <FaSignOutAlt className="w-4 h-4" />
//                 <span>Logout</span>
//               </button>
//               {/* Mobile hamburger */}
//               <button
//                 className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
//                 onClick={() => setMenuOpen(!menuOpen)}
//               >
//                 {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ====== BOTTOM BAR ====== */}
//         <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-10 border-t border-white/10">
//           <div className="flex justify-between items-center h-16">
//             {/* Branding */}
//             <div className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center space-x-1">
//               <span className="text-white">Duo</span>
//               <span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent">
//                 Drive
//               </span>
//               <span className="text-white">Kenya</span>
//             </div>

//             {/* Desktop nav */}
//             <div className="hidden lg:flex items-center space-x-3">
//               {navItems.map(({ path, label, icon: Icon }) => (
//                 <NavLink
//                   key={path}
//                   to={path}
//                   className={({ isActive }) =>
//                     `group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
//                       isActive
//                         ? "text-[#2fa88a] bg-[#2fa88a]/10"
//                         : "text-white/80 hover:text-[#2fa88a] hover:bg-white/5"
//                     }`
//                   }
//                 >
//                   <Icon className="w-4 h-4 flex-shrink-0" />
//                   <span className="text-sm font-medium">{label}</span>
//                 </NavLink>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ====== MOBILE MENU ====== */}
//         {menuOpen && (
//           <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
//             <div className="max-w-7xl mx-auto px-6 py-6 space-y-3">
//               {navItems.map(({ path, label, icon: Icon }) => (
//                 <NavLink
//                   key={path}
//                   to={path}
//                   className={({ isActive }) =>
//                     `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                       isActive
//                         ? "text-[#2fa88a] bg-[#2fa88a]/10"
//                         : "text-white/80 hover:text-[#2fa88a] hover:bg-white/5"
//                     }`
//                   }
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   <Icon className="w-5 h-5 flex-shrink-0" />
//                   <span className="font-medium">{label}</span>
//                 </NavLink>
//               ))}
//               {/* Logout Mobile */}
//               <button
//                 onClick={() => {
//                   setMenuOpen(false);
//                   setShowLogoutModal(true);
//                 }}
//                 className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-red-400 hover:bg-white/5 transition-all duration-200 mt-4 border-t border-white/10 pt-6"
//               >
//                 <FaSignOutAlt className="w-5 h-5" />
//                 <span className="font-medium">Logout</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* ====== LOGOUT MODAL ====== */}
// {showLogoutModal && (
//   <div className="fixed inset-0 flex items-center justify-center z-50 px-4 min-h-screen bg-black/50 backdrop-blur-sm">
//     <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold text-white">Confirm Logout</h2>
//         <button
//           onClick={() => setShowLogoutModal(false)}
//           className="text-white/70 hover:text-white transition p-1 rounded-lg"
//         >
//           <FaTimes className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Message */}
//       <p className="text-white/80 mb-6 text-base">
//         Are you sure you want to logout?
//       </p>

//       {/* Actions */}
//       <div className="flex gap-4">
//         <button
//           onClick={handleLogout}
//           className="flex-1 py-3 rounded-lg font-semibold text-white shadow-md bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] hover:opacity-90 transition"
//         >
//           Yes, Logout
//         </button>
//         <button
//           onClick={() => setShowLogoutModal(false)}
//           className="flex-1 py-3 rounded-lg font-semibold text-white bg-white/30 backdrop-blur-md hover:bg-white/20 transition"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//  </>
//   );
// };

// export default BuyerNavbar;