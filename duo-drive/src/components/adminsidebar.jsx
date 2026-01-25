// import React, { useState, useEffect } from "react";
// import { getContacts } from "../utils/api";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   FaTachometerAlt,
//   FaCar,
//   FaUsers,
//   FaMoneyBillWave,
//   FaBell,
//   FaChevronLeft,
//   FaChevronRight,
//   FaSignOutAlt,
//   FaMoneyCheckAlt,
//   FaUserPlus,
// } from "react-icons/fa";
// import { FaTimes } from "react-icons/fa";

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [pendingLeads, setPendingLeads] = useState(0);

//   const jungleGreen = "#2fa88a";

//   const menuItems = [
//     { name: "Dashboard", icon: FaTachometerAlt, link: "/admin/dashboard" },
//     { name: "Inventory", icon: FaCar, link: "/admin/inventory" },
//     { name: "Users", icon: FaUsers, link: "/admin/users" },
//     { name: "Sales", icon: FaMoneyBillWave, link: "/admin/sales" },
//     { name: "Expenses", icon: FaMoneyCheckAlt, link: "/admin/expenses" },
//     { name: "Leads", icon: FaUserPlus, link: "/admin/leads" },

//   ];

//   useEffect(() => {
//   const fetchPending = async () => {
//     const res = await getContacts();
//     const pending = res.data.filter(
//       (l) => (l.status || "pending") === "pending"
//     ).length;
//     setPendingLeads(pending);
//   };

//   fetchPending();
//   const interval = setInterval(fetchPending, 30000);
//   return () => clearInterval(interval);
// }, []);

//   const navigate = useNavigate();

//   const handleLogout = () => { setShowLogoutModal(false);
//      // Clear auth tokens or session here
//       localStorage.removeItem("authToken");
//      console.log("Logged out!");
//      // Redirect to login page
//       navigate("/login"); };

//   return (
//     <>
//       <aside
//         className={`h-screen bg-white border-r flex flex-col transition-all duration-300 ${
//           collapsed ? "w-20" : "w-64"
//         }`}
//       >
//         {/* Header */}
//         <div className="h-16 flex items-center justify-between px-4 border-b">
//           <div className="flex items-center gap-3">
//             <div
//               className="w-9 h-9 rounded-lg flex items-center justify-center"
//               style={{ backgroundColor: jungleGreen }}
//             >
//               <FaCar className="text-white" />
//             </div>

//             {!collapsed && (
//               <span
//                 className="text-lg font-bold tracking-wide"
//                 style={{ color: jungleGreen }}
//               >
//                 DuoDrive Admin
//               </span>
//             )}
//           </div>

//           <button
//             onClick={() => setCollapsed(!collapsed)}
//              className="p-3 transition-colors"
//           >
//             {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
//           </button>
//         </div>

//         {/* Menu */}
//         <nav className="flex-1 px-2 py-4">
//           {!collapsed && (
//             <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
//               Main Menu
//             </p>
//           )}

//           <ul className="space-y-1">
//             {menuItems.map(({ name, icon: Icon, link }) => (
//               <li key={name}>
//                 <NavLink
//                   to={link}
//                   className={({ isActive }) =>
//                     `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
//                     ${
//                       isActive ? "text-white" : "text-gray-600 hover:bg-gray-100"
//                     }`
//                   }
//                   style={({ isActive }) => ({
//                     backgroundColor: isActive ? jungleGreen : "transparent",
//                   })}
//                 >

//                   {({ isActive }) => (
//                     <>
//                      {/* Leads Badge */}
//                   {name === "Leads" && pendingLeads > 0 && !collapsed && (
//                     <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                       {pendingLeads}
//                     </span>
//                   )}
//                       {/* Active Indicator */}
//                       <span
//                         className={`absolute left-0 top-0 h-full w-1 rounded-r transition-opacity ${
//                           isActive ? "opacity-100" : "opacity-0"
//                         }`}
//                         style={{ backgroundColor: jungleGreen }}
//                       />
//                       <Icon className="text-lg shrink-0" />
//                       {!collapsed && <span>{name}</span>}

//                       {/* Tooltip when collapsed */}
//                       {collapsed && (
//                         <span className="absolute left-full ml-3 px-3 py-1 text-xs rounded-md bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
//                           {name}
//                         </span>
//                       )}
//                     </>
//                   )}
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Footer */}
//         <div className="border-t px-3 py-3 flex flex-col gap-3">
//           <div className="flex items-center gap-3">
//             <div
//               className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
//               style={{ backgroundColor: jungleGreen }}
//             >
//               A
//             </div>

//             {!collapsed && (
//               <>
//                 <div className="flex-1 leading-tight">
//                   <p className="text-sm font-semibold text-gray-800">Admin User</p>
//                   <p className="text-xs text-gray-500">admin@carsales.com</p>
//                 </div>

//                 <div className="relative">
//                   <FaBell className="text-gray-400" />
//                   <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Logout Button */}
//           <button
//             onClick={() => setShowLogoutModal(true)}
//             className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 ${
//               collapsed ? "justify-center" : ""
//             }`}
//             style={{ backgroundColor: jungleGreen, color: "white" }}
//           >
//             <FaSignOutAlt /> {!collapsed && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Logout Confirmation Modal */}
//       {showLogoutModal && (
//         <GlassModal
//           onClose={() => setShowLogoutModal(false)}
//           title="Confirm Logout"
//         >
//           <p>Are you sure you want to logout?</p>
//           <div className="mt-4 flex gap-3">
//             <button
//               onClick={handleLogout}
//               className="flex-1 text-white py-2 rounded-lg font-medium hover:opacity-90"
//               style={{ backgroundColor: jungleGreen }}
//             >
//               Yes, Logout
//             </button>
//             <button
//               onClick={() => setShowLogoutModal(false)}
//               className="flex-1 bg-gray-200 text-black py-2 rounded-lg font-medium hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//           </div>
//         </GlassModal>
//       )}
//     </>
//   );
// };

// // Glassmorphic Modal Component
// const GlassModal = ({ onClose, title, children }) => (
//   <div
//     className="fixed inset-0 flex items-center justify-center z-50"
//     style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
//   >
//     <div
//       className="relative rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
//       style={{
//         background: "rgba(255,255,255,0.95)",
//         backdropFilter: "blur(20px)",
//         border: "1px solid rgba(255,255,255,0.5)",
//       }}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold text-black">{title}</h2>
//         <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">
//           <FaTimes />
//         </button>
//       </div>
//       {children}
//     </div>
//   </div>
// );

// export default Sidebar;

import React, { useState, useEffect } from "react";
import { getContacts } from "../utils/api";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaUsers,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaUserPlus,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaBell,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pendingLeads, setPendingLeads] = useState(0);
  const jungleGreen = "#2fa88a";

  const menuItems = [
    { name: "Dashboard", icon: FaTachometerAlt, link: "/admin/dashboard" },
    { name: "Inventory", icon: FaCar, link: "/admin/inventory" },
    { name: "Users", icon: FaUsers, link: "/admin/users" },
    { name: "Sales", icon: FaMoneyBillWave, link: "/admin/sales" },
    { name: "Expenses", icon: FaMoneyCheckAlt, link: "/admin/expenses" },
    { name: "Leads", icon: FaUserPlus, link: "/admin/leads" },
  ];

  useEffect(() => {
    const fetchPending = async () => {
      const res = await getContacts();
      const pending = res.data.filter(
        (l) => (l.status || "pending") === "pending",
      ).length;
      setPendingLeads(pending);
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: jungleGreen }}
            >
              <FaCar className="text-white" />
            </div>
            {!collapsed && (
              <span
                className="text-lg font-bold tracking-wide"
                style={{ color: jungleGreen }}
              >
                DuoDrive Admin
              </span>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="p-3">
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 py-4">
          {!collapsed && (
            <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase">
              Main Menu
            </p>
          )}
          <ul className="space-y-1">
            {menuItems.map(({ name, icon: Icon, link }) => (
              <li key={name}>
                <NavLink
                  to={link}
                  className={({ isActive }) =>
                    `group relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? jungleGreen : "transparent",
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      <span
                        className={`absolute left-0 top-0 h-full w-1 rounded-r ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ backgroundColor: jungleGreen }}
                      />

                      {/* Icon */}
                      <div className="relative">
                        <Icon className="text-lg shrink-0" />

                        {/* Red dot when collapsed */}
                        {name === "Leads" && pendingLeads > 0 && collapsed && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                        )}
                      </div>

                      {/* Label */}
                      {!collapsed && <span className="ml-2">{name}</span>}

                      {/* Badge when expanded */}
                      {name === "Leads" && pendingLeads > 0 && !collapsed && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {pendingLeads}
                        </span>
                      )}

                      {/* Tooltip when collapsed */}
                      {collapsed && (
                        <span className="absolute left-full ml-3 px-3 py-1 text-xs rounded-md bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          {name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t px-3 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: jungleGreen }}
            >
              A
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 leading-tight">
                  <p className="text-sm font-semibold text-gray-800">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@carsales.com</p>
                </div>
                <div className="relative">
                  <FaBell className="text-gray-400" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 ${
              collapsed ? "justify-center" : ""
            }`}
            style={{ backgroundColor: jungleGreen, color: "white" }}
          >
            <FaSignOutAlt /> {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="relative rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Confirm Logout</h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                <FaTimes />
              </button>
            </div>
            <p>Are you sure you want to logout?</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 text-white py-2 rounded-lg font-medium hover:opacity-90"
                style={{ backgroundColor: jungleGreen }}
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-200 text-black py-2 rounded-lg font-medium hover:bg-gray-300"
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

export default Sidebar;
