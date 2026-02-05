// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import BuyerSidebar from "../components/buyersidebar"; // import the buyer sidebar

// const BuyerLayout = () => {
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);

//   useEffect(() => {
//     // Check authentication
//     const role = localStorage.getItem("role");
//     if (!role || role !== "buyer") {
//       navigate("/login");
//     }

//     let timeout;
//     const resetTimer = () => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         // Clear session
//         localStorage.removeItem("role");
//         setShowModal(true);
//       }, 1000 * 660); // 11 minutes inactivity (adjust as needed)
//     };

//     window.addEventListener("mousemove", resetTimer);
//     window.addEventListener("keydown", resetTimer);
//     window.addEventListener("click", resetTimer);
//     resetTimer();

//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener("mousemove", resetTimer);
//       window.removeEventListener("keydown", resetTimer);
//       window.removeEventListener("click", resetTimer);
//     };
//   }, [navigate]);

//   const handleRedirect = () => {
//     setShowModal(false);
//     navigate("/login");
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar fixed on the left */}
//       <BuyerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

//       {/* Content area shifts depending on sidebar width */}
//       <div
//         className={`transition-all duration-300 ${
//           collapsed ? "ml-20" : "ml-64"
//         } w-full`}
//       >
//         <Outlet />
//       </div>

//       {/* Session timeout modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
//           <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white text-center">
//             <h2 className="text-3xl font-extrabold text-green-800 mb-4">
//               Session Expired
//             </h2>
//             <p className="text-black mb-6">
//               You have been inactive for{" "}
//               <span className="font-semibold text-green-700">11 minutes</span>.
//               Please log in again.
//             </p>
//             <div className="w-16 h-1 bg-green-700 mx-auto mb-6 rounded-full"></div>
//             <button
//               onClick={handleRedirect}
//               className="bg-green-700 hover:bg-green-900 text-white font-semibold py-2 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
//             >
//               Re‑Login
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuyerLayout;

// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { User } from "lucide-react";
// import Footer from "../components/footer";
// import Navbar from "../components/buyernavbar";

// const BuyerLayout = () => {
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(3);
//   const [navHeight, setNavHeight] = useState(0);

//   useEffect(() => {
//     const nav = document.getElementById("navbar");
//     if (nav) setNavHeight(nav.offsetHeight);
//   }, []);

//   useEffect(() => {
//     const role = localStorage.getItem("role");

//     if (role !== "buyer") {
//       navigate("/login", { replace: true });
//     }

//     let timeout;
//     const resetTimer = () => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         localStorage.removeItem("role");
//         localStorage.removeItem("authToken");
//         setShowModal(true);
//       }, 1000 * 3600);
//     };

//     window.addEventListener("mousemove", resetTimer);
//     window.addEventListener("keydown", resetTimer);
//     window.addEventListener("click", resetTimer);
//     resetTimer();

//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener("mousemove", resetTimer);
//       window.removeEventListener("keydown", resetTimer);
//       window.removeEventListener("click", resetTimer);
//     };
//   }, [navigate]);

//   const handleRedirect = () => {
//     setShowModal(false);
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
//       {" "}
//       <header
//         id="navbar"
//         className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-green-100 shadow-sm"
//       >
//         {" "}
//         <Navbar />{" "}
//       </header>{" "}
//       <main style={{ paddingTop: navHeight }}>
//         {" "}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {" "}
//           <Outlet />{" "}
//         </div>{" "}
//       </main>{" "}
//       <Footer />
//       {/* Session Timeout Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
//           <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
//             <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
//               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <User className="w-8 h-8" />
//               </div>
//               <h2 className="text-2xl font-bold text-center">
//                 Session Expired
//               </h2>
//             </div>
//             <div className="p-8 text-center">
//               <p className="text-gray-600 mb-2">
//                 You've been inactive for{" "}
//                 <span className="font-semibold text-green-700">1 minute</span>.
//               </p>
//               <p className="text-gray-600 mb-6">
//                 For your security, please log in again to continue shopping.
//               </p>
//               <button
//                 onClick={handleRedirect}
//                 className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
//               >
//                 Log In Again
//               </button>
//               <p className="text-xs text-gray-500 mt-4">
//                 Your cart and favorites have been saved
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuyerLayout;

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import Footer from "../components/footer";
import Navbar from "../components/buyernavbar";

const BuyerLayout = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  /* =============================
     NAVBAR HEIGHT
  ============================== */
  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.getElementById("buyer-navbar");
      if (nav) {
        setNavHeight(nav.offsetHeight);

        // Optional: also expose as CSS variable
        document.documentElement.style.setProperty(
          "--buyer-nav-height",
          `${nav.offsetHeight}px`
        );
      }
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);

    return () => window.removeEventListener("resize", updateNavHeight);
  }, []);

//   //* =============================
//    AUTH + SESSION TIMEOUT
// ============================== */
useEffect(() => {
  const role = localStorage.getItem("role");

  if (role !== "buyer") {
    navigate("/login", { replace: true });
    return;
  }

  let timeout;

  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      localStorage.removeItem("role");
      localStorage.removeItem("authToken");
      setShowModal(true);
    }, 1000 * 13600 * 60); // 1 hour
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* FIXED NAVBAR */}
      <header
        id="buyer-navbar"
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl"
      >
        <Navbar />
      </header>

      {/* PAGE CONTENT */}
      <main
        style={{ paddingTop: navHeight }}
        className="min-h-screen"
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <Footer />

      {/* SESSION TIMEOUT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/20">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Session Expired</h2>
            </div>

            <div className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                You've been inactive for too long.
                <br />
                Please log in again to continue.
              </p>

              <button
                onClick={handleRedirect}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
              >
                Log In Again
              </button>

              <p className="text-xs text-gray-500 mt-4">
                Your cart and favorites are safe
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerLayout;
