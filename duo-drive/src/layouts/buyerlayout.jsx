// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { User } from "lucide-react";
// import Footer from "../components/footer";
// import Navbar from "../components/buyernavbar";

// const BuyerLayout = () => {
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [navHeight, setNavHeight] = useState(0);

//   /* =============================
//      NAVBAR HEIGHT
//   ============================== */
//   useEffect(() => {
//     const updateNavHeight = () => {
//       const nav = document.getElementById("buyer-navbar");
//       if (nav) {
//         setNavHeight(nav.offsetHeight);

//         // Optional: also expose as CSS variable
//         document.documentElement.style.setProperty(
//           "--buyer-nav-height",
//           `${nav.offsetHeight}px`
//         );
//       }
//     };

//     updateNavHeight();
//     window.addEventListener("resize", updateNavHeight);

//     return () => window.removeEventListener("resize", updateNavHeight);
//   }, []);

// //   //* =============================
// //    AUTH + SESSION TIMEOUT
// // ============================== */
// useEffect(() => {
//   const role = localStorage.getItem("role");

//   if (role !== "buyer") {
//     navigate("/login", { replace: true });
//     return;
//   }

//   let timeout;

//   const resetTimer = () => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => {
//       localStorage.removeItem("role");
//       localStorage.removeItem("authToken");
//       setShowModal(true);
//     }, 1000 * 13600 * 60); // 1 hour
//   };

//   window.addEventListener("mousemove", resetTimer);
//   window.addEventListener("keydown", resetTimer);
//   window.addEventListener("click", resetTimer);

//   resetTimer();

//   return () => {
//     clearTimeout(timeout);
//     window.removeEventListener("mousemove", resetTimer);
//     window.removeEventListener("keydown", resetTimer);
//     window.removeEventListener("click", resetTimer);
//   };
// }, [navigate]);


//   const handleRedirect = () => {
//     setShowModal(false);
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
//       {/* FIXED NAVBAR */}
//       <header
//         id="buyer-navbar"
//         className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl"
//       >
//         <Navbar />
//       </header>

//       {/* PAGE CONTENT */}
//       <main
//         style={{ paddingTop: navHeight }}
//         className="min-h-screen"
//       >
//         <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <Outlet />
//         </div>
//       </main>

//       <Footer />

//       {/* SESSION TIMEOUT MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//           <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
//             <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white text-center">
//               <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/20">
//                 <User className="w-8 h-8" />
//               </div>
//               <h2 className="text-2xl font-bold">Session Expired</h2>
//             </div>

//             <div className="p-8 text-center">
//               <p className="text-gray-600 mb-6">
//                 You've been inactive for too long.
//                 <br />
//                 Please log in again to continue.
//               </p>

//               <button
//                 onClick={handleRedirect}
//                 className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
//               >
//                 Log In Again
//               </button>

//               <p className="text-xs text-gray-500 mt-4">
//                 Your cart and favorites are safe
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
import Footer from "../components/footer";
import Navbar from "../components/buyernavbar";

const BuyerLayout = () => {
  const navigate = useNavigate();
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

  /* =============================
     AUTH CHECK (NO AUTO-LOGOUT)
  ============================== */
  useEffect(() => {
    const role = sessionStorage.getItem("role");

    // Only redirect if user is not a buyer
    if (role !== "buyer") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

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
      <main style={{ paddingTop: navHeight }} className="min-h-screen">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyerLayout;