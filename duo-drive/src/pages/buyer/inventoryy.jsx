// // src/pages/Inventory.jsx
// import Footer from "../../components/footer";
// import { useEffect, useState } from "react";
// import { AiOutlineMessage, AiOutlineHeart, AiOutlineCar } from "react-icons/ai";
// import { FiFilter } from "react-icons/fi";
// import { HiSparkles } from "react-icons/hi";
// import financing from "../../assets/finacing.png";
// import { getCars } from "../../utils/api";
// import { useNavigate } from "react-router-dom";

// const Inventory = () => {
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     model: "",
//     fuel: "",
//     priceRange: "",
//   });
//   const [showAIModal, setShowAIModal] = useState(false);
//   const [userName, setUserName] = useState("");

//   const navigate = useNavigate();

//   /* -------- FETCH CARS & USER -------- */
//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const res = await getCars();
//         setCars(res.data);
//       } catch (err) {
//         console.error("Failed to fetch cars", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCars();

//     // Get user name
//     const name = localStorage.getItem("userName");
//     setUserName(name || "");
//   }, []);

//   /* -------- NEW CAR CHECK (≤ 3 DAYS) -------- */
//   const isNewCar = (createdAt) => {
//     const created = new Date(createdAt);
//     const now = new Date();
//     return (now - created) / (1000 * 60 * 60 * 24) <= 3;
//   };

//   /* -------- FILTER LOGIC (KES) -------- */
//   const filteredCars = cars.filter((car) => {
//     const price = Number(car.final_price || car.price);

//     const matchModel = !filters.model || car.model === filters.model;
//     const matchFuel = !filters.fuel || car.fuel_type === filters.fuel;
//     const matchPrice =
//       !filters.priceRange ||
//       (filters.priceRange === "<1M" && price < 1_000_000) ||
//       (filters.priceRange === "1M-2M" &&
//         price >= 1_000_000 &&
//         price <= 2_000_000) ||
//       (filters.priceRange === "2M-3M" &&
//         price > 2_000_000 &&
//         price <= 3_000_000) ||
//       (filters.priceRange === ">3M" && price > 3_000_000);

//     return matchModel && matchFuel && matchPrice;
//   });

//   const resetFilters = () => {
//     setFilters({ model: "", fuel: "", priceRange: "" });
//   };

//   return (
//     <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
//       {/* FILTER NAVBAR */}
//       <div className="sticky top-20 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 gap-4">
//             {/* Filter Icon & Title */}
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] rounded-lg">
//                 <FiFilter className="w-5 h-5 text-white" />
//               </div>
//               <span className="font-semibold text-gray-800 hidden sm:block">
//                 Filter Your Dream Car
//               </span>
//             </div>

//             {/* Filter Controls */}
//             <div className="flex items-center gap-2 flex-1 justify-end max-w-4xl">
//               {/* Make Filter */}
//               <select
//                 name="model"
//                 value={filters.model}
//                 onChange={(e) =>
//                   setFilters({ ...filters, model: e.target.value })
//                 }
//                 className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700
//                 hover:border-[#2fa88a] focus:border-[#2fa88a] focus:ring-2 focus:ring-[#2fa88a]/20
//                 transition-all outline-none cursor-pointer"
//               >
//                 <option value="">All Makes</option>
//                 {[...new Set(cars.map((c) => c.model))].map((opt) => (
//                   <option key={opt} value={opt}>
//                     {opt}
//                   </option>
//                 ))}
//               </select>

//               {/* Price Range Filter */}
//               <select
//                 name="priceRange"
//                 value={filters.priceRange}
//                 onChange={(e) =>
//                   setFilters({ ...filters, priceRange: e.target.value })
//                 }
//                 className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700
//                 hover:border-[#2fa88a] focus:border-[#2fa88a] focus:ring-2 focus:ring-[#2fa88a]/20
//                 transition-all outline-none cursor-pointer"
//               >
//                 <option value="">All Prices</option>
//                 <option value="<1M">Under 1M</option>
//                 <option value="1M-2M">1M - 2M</option>
//                 <option value="2M-3M">2M - 3M</option>
//                 <option value=">3M">Above 3M</option>
//               </select>

//               {/* Fuel Type Filter */}
//               <select
//                 name="fuel"
//                 value={filters.fuel}
//                 onChange={(e) =>
//                   setFilters({ ...filters, fuel: e.target.value })
//                 }
//                 className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700
//                 hover:border-[#2fa88a] focus:border-[#2fa88a] focus:ring-2 focus:ring-[#2fa88a]/20
//                 transition-all outline-none cursor-pointer"
//               >
//                 <option value="">All Fuel Types</option>
//                 <option value="petrol">Petrol</option>
//                 <option value="diesel">Diesel</option>
//                 <option value="hybrid">Hybrid</option>
//                 <option value="electric">Electric</option>
//               </select>

//               {/* Reset Button */}
//               {(filters.model || filters.fuel || filters.priceRange) && (
//                 <button
//                   onClick={resetFilters}
//                   className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2fa88a]
//                   bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
//                 >
//                   Reset
//                 </button>
//               )}

//               {/* AI Assistant Button */}
//               <button
//                 onClick={() => setShowAIModal(true)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg
//                 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white
//                 shadow-lg hover:shadow-xl hover:scale-105 transition-all font-medium text-sm"
//               >
//                 <HiSparkles className="w-5 h-5" />
//                 <span className="hidden md:inline">AI Assistant</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* WELCOME BANNER */}
//       <div className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white">
//         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold mb-2">
//                 Welcome back, {userName.split(" ")[0] || "there"}! 👋
//               </h1>
//               <p className="text-white/90 text-lg">
//                 Discover your perfect ride from our premium collection
//               </p>
//             </div>
//             <div className="hidden lg:block">
//               <div className="flex items-center gap-6">
//                 <div className="text-center">
//                   <div className="text-3xl font-bold">{cars.length}</div>
//                   <div className="text-white/80 text-sm">Total Cars</div>
//                 </div>
//                 <div className="w-px h-12 bg-white/30" />
//                 <div className="text-center">
//                   <div className="text-3xl font-bold">{filteredCars.length}</div>
//                   <div className="text-white/80 text-sm">Available</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <AiOutlineCar className="text-[#2fa88a]" />
//               Available Vehicles
//             </h2>
//             <p className="text-gray-600 mt-1">
//               {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"} match your criteria
//             </p>
//           </div>

//           {/* Quick Actions */}
//           <div className="hidden md:flex items-center gap-3">
//             <button
//               onClick={() => navigate("/buyer/favourites")}
//               className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200
//               hover:border-[#2fa88a] text-gray-700 hover:text-[#2fa88a] transition-all"
//             >
//               <AiOutlineHeart className="w-5 h-5" />
//               <span>My Favourites</span>
//             </button>
//           </div>
//         </div>

//         {/* CAR GRID */}
//         {loading ? (
//           <div className="flex items-center justify-center h-96">
//             <div className="text-center">
//               <div className="w-16 h-16 border-4 border-[#2fa88a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//               <p className="text-gray-600 font-medium">Loading your dream cars...</p>
//             </div>
//           </div>
//         ) : filteredCars.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AiOutlineCar className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
//             <p className="text-gray-600 mb-6">Try adjusting your filters to see more options</p>
//             <button
//               onClick={resetFilters}
//               className="px-6 py-3 bg-[#2fa88a] text-white rounded-lg font-medium hover:opacity-90 transition"
//             >
//               Clear All Filters
//             </button>
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredCars.map((car) => (
//               <div
//                 key={car.id}
//                 className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl
//                 overflow-hidden border border-gray-100 hover:border-[#2fa88a]/30
//                 transition-all duration-300 hover:-translate-y-1"
//               >
//                 {/* NEW Badge */}
//                 {isNewCar(car.created_at) && (
//                   <div className="absolute top-4 left-4 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a]
//                   text-white text-xs px-3 py-1.5 rounded-full font-bold z-10 shadow-lg">
//                     🔥 NEW
//                   </div>
//                 )}

//                 {/* DISCOUNT Badge */}
//                 {car.discount_percent > 0 && (
//                   <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600
//                   text-white text-xs px-3 py-1.5 rounded-full font-bold z-10 shadow-lg">
//                     {car.discount_percent}% OFF
//                   </div>
//                 )}

//                 {/* Favourite Button */}
//                 <button
//                   className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm
//                   rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     // Add to favourites logic
//                   }}
//                 >
//                   <AiOutlineHeart className="w-5 h-5 text-gray-700 hover:text-red-500 transition" />
//                 </button>

//                 {/* IMAGE */}
//                 <div className="relative overflow-hidden aspect-[4/3]">
//                   {car.images?.length > 0 ? (
//                     <img
//                       src={car.images[0].url}
//                       alt={car.name}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200
//                     flex items-center justify-center">
//                       <AiOutlineCar className="w-16 h-16 text-gray-400" />
//                     </div>
//                   )}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0
//                   group-hover:opacity-100 transition-opacity" />
//                 </div>

//                 {/* CONTENT */}
//                 <div className="p-5">
//                   <div className="mb-3">
//                     <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2fa88a] transition">
//                       {car.model} {car.name}
//                     </h3>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {car.fuel_type} • {car.year || "2024"}
//                     </p>
//                   </div>

//                   {/* PRICE */}
//                   <div className="mb-4 pb-4 border-b border-gray-100">
//                     {car.discount_percent > 0 ? (
//                       <div>
//                         <p className="text-2xl font-bold text-[#2fa88a]">
//                           KES {Number(car.final_price).toLocaleString()}
//                         </p>
//                         <p className="text-sm text-gray-400 line-through">
//                           KES {Number(car.price).toLocaleString()}
//                         </p>
//                       </div>
//                     ) : (
//                       <p className="text-2xl font-bold text-[#2fa88a]">
//                         KES {Number(car.price).toLocaleString()}
//                       </p>
//                     )}
//                   </div>

//                   {/* ACTION BUTTONS */}
//                   <div className="space-y-2">
//                     <button
//                       onClick={() => navigate(`/buyer/details/${car.id}`)}
//                       className="w-full bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white
//                       py-2.5 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02]
//                       transition-all duration-200"
//                     >
//                       View Details
//                     </button>
//                     <button
//                       onClick={() => navigate("/contact", { state: { car } })}
//                       className="w-full border-2 border-[#2fa88a] text-[#2fa88a] py-2.5
//                       rounded-lg font-semibold hover:bg-[#2fa88a] hover:text-white
//                       transition-all duration-200"
//                     >
//                       Contact Seller
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* FINANCING PROMO */}
//         {filteredCars.length > 0 && (
//           <div className="mt-16 mb-8">
//             <div className="relative group max-w-4xl mx-auto">
//               <div className="absolute -inset-1 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a]
//               rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition" />
//               <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
//                 <div className="grid md:grid-cols-2 gap-8 items-center p-8">
//                   <div>
//                     <h3 className="text-3xl font-bold text-gray-900 mb-4">
//                       Need Financing?
//                     </h3>
//                     <p className="text-gray-600 mb-6 text-lg">
//                       Get pre-approved in minutes with our trusted partners.
//                       Flexible terms and competitive rates available.
//                     </p>
//                     <button className="px-8 py-3 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a]
//                     text-white rounded-lg font-semibold hover:shadow-lg transition-all">
//                       Learn More
//                     </button>
//                   </div>
//                   <div className="relative">
//                     <img
//                       src={financing}
//                       alt="Financing"
//                       className="w-full h-auto rounded-xl shadow-lg"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* AI MODAL */}
//       {showAIModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 px-4"
//           style={{
//             backgroundColor: "rgba(0,0,0,0.6)",
//             backdropFilter: "blur(8px)",
//           }}
//           onClick={() => setShowAIModal(false)}
//         >
//           <div
//             className="relative rounded-2xl p-8 max-w-lg w-full shadow-2xl"
//             style={{
//               background: "rgba(255,255,255,0.95)",
//               backdropFilter: "blur(20px)",
//               border: "1px solid rgba(255,255,255,0.5)",
//             }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="text-center">
//               <div className="w-16 h-16 bg-gradient-to-br from-[#1f7a63] to-[#2fa88a]
//               rounded-full flex items-center justify-center mx-auto mb-4">
//                 <HiSparkles className="w-8 h-8 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-3">
//                 DuoDrive AI Assistant
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 Get personalized car recommendations based on your preferences and budget.
//                 Coming soon!
//               </p>
//               <button
//                 onClick={() => setShowAIModal(false)}
//                 className="w-full px-6 py-3 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a]
//                 text-white rounded-lg font-semibold hover:opacity-90 transition"
//               >
//                 Got it!
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Inventory;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/footer";
import financing from "../../assets/finacing.png";
import { getCars, toggleFavourite, getFavourites } from "../../utils/api";

import { AiOutlineCar, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiFilter, FiX } from "react-icons/fi";
import { HiSparkles, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { BsGrid3X3Gap, BsListUl } from "react-icons/bs";

/* ================= CONFIG ================= */
const CARS_PER_PAGE = 8;

const PRICE_FILTERS = {
  "<1M": (p) => p < 1_000_000,
  "1M-2M": (p) => p >= 1_000_000 && p <= 2_000_000,
  "2M-3M": (p) => p > 2_000_000 && p <= 3_000_000,
  ">3M": (p) => p > 3_000_000,
};

/* ================= HELPERS ================= */
const extractArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const isNewCar = (createdAt) => {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  return (now - created) / (1000 * 60 * 60 * 24) <= 3;
};

const Inventory = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  /* ================= STATE ================= */
  const [cars, setCars] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const [filters, setFilters] = useState({
    model: "",
    fuel: "",
    priceRange: "",
  });

  const [page, setPage] = useState(1);

  // AI
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const userName = localStorage.getItem("userName") || "";
  const userId = localStorage.getItem("userId") || "";

  /* ================= FETCH ================= */
  useEffect(() => {
    loadCars();
    loadFavourites();
  }, []);

  const loadCars = async () => {
    try {
      const res = await getCars();

      const carsData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
          ? res.data.results
          : [];

      setCars(carsData);
      console.log("✅ Cars loaded:", carsData.length);
    } catch (err) {
      console.error("❌ Cars load failed:", err);
      console.error(err.response?.data || err.message);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavourites = async () => {
    if (!userId) return;
    try {
      const favs = await getFavourites(userId);
      setFavourites(favs.map((f) => f.car.id)); // store IDs only
    } catch (err) {
      console.error("Favourites load failed:", err);
      const saved = localStorage.getItem(`favourites_${userId}`);
      if (saved) {
        setFavourites(JSON.parse(saved));
      }
    }
  };

  /* ================= FILTER ================= */
  const filteredCars = useMemo(() => {
    if (!Array.isArray(cars)) return [];

    return cars.filter((car) => {
      if (!car) return false;

      const price = Number(car.final_price ?? car.price ?? 0);

      if (filters.model && car.model !== filters.model) return false;
      if (filters.fuel && car.fuel_type !== filters.fuel) return false;
      if (filters.priceRange && !PRICE_FILTERS[filters.priceRange]?.(price))
        return false;

      return true;
    });
  }, [cars, filters]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCars.length / CARS_PER_PAGE),
  );

  const paginatedCars = filteredCars.slice(
    (page - 1) * CARS_PER_PAGE,
    page * CARS_PER_PAGE,
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= FAVOURITES ================= */
  const handleToggleFavourite = async (carId) => {
    // Optimistically update local state
    setFavourites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId],
    );

    // Optionally, save to localStorage for persistence
    if (userId) {
      const updatedFavourites = favourites.includes(carId)
        ? favourites.filter((id) => id !== carId)
        : [...favourites, carId];
      localStorage.setItem(
        `favourites_${userId}`,
        JSON.stringify(updatedFavourites),
      );
    }

    try {
      // Call API
      const result = await toggleFavourite(carId);
      console.log(result.message);
    } catch (err) {
      console.error("Toggle favourite failed:", err);

      // Rollback if API fails
      setFavourites((prev) =>
        prev.includes(carId)
          ? prev.filter((id) => id !== carId)
          : [...prev, carId],
      );
    }
  };

  /* ================= AI ================= */
  const askAI = async () => {
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiResponse("");

    try {
      const res = await axios.post("/api/ai/recommend/", {
        prompt: aiPrompt,
      });
      setAiResponse(res.data?.message || "No response.");
    } catch (err) {
      console.error("AI error:", err);
      setAiResponse(
        "Sorry, I couldn't process your request. Please try again.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({ model: "", fuel: "", priceRange: "" });
    setPage(1);
  };

  const hasActiveFilters = filters.model || filters.fuel || filters.priceRange;

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* ==================== FILTER BAR (STICKY) ==================== */}
      <div
        className="
      sticky
      z-40
      bg-white/90
      backdrop-blur-xl
      border-b border-gray-200
      shadow-sm
    "
        style={{ top: "var(--buyer-nav-height)" }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* ================= LEFT ================= */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2 bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] rounded-lg">
                <FiFilter className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800 hidden sm:block">
                Filter Your Dream Car
              </span>
            </div>

            {/* ================= CENTER ================= */}
            <div className="flex items-center gap-2 flex-1 justify-center max-w-3xl">
              <select
                value={filters.model}
                onChange={(e) => {
                  setFilters({ ...filters, model: e.target.value });
                  setPage(1);
                }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium 
            text-gray-700 hover:border-[#2fa88a] focus:border-[#2fa88a] focus:ring-2 
            focus:ring-[#2fa88a]/20 transition-all outline-none cursor-pointer"
              >
                <option value="">All Makes</option>
                {[...new Set(cars.map((c) => c?.model).filter(Boolean))].map(
                  (m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ),
                )}
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => {
                  setFilters({ ...filters, priceRange: e.target.value });
                  setPage(1);
                }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium 
            text-gray-700 hover:border-[#2fa88a] focus:border-[#2fa88a] focus:ring-2 
            focus:ring-[#2fa88a]/20 transition-all outline-none cursor-pointer"
              >
                <option value="">All Prices</option>
                <option value="<1M">Under 1M</option>
                <option value="1M-2M">1M – 2M</option>
                <option value="2M-3M">2M – 3M</option>
                <option value=">3M">Above 3M</option>
              </select>

              <select
                value={filters.fuel}
                onChange={(e) => {
                  setFilters({ ...filters, fuel: e.target.value });
                  setPage(1);
                }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium 
            text-gray-700 hover:border-[#2fa88a] focus:border-[#2fa88a] focus:ring-2 
            focus:ring-[#2fa88a]/20 transition-all outline-none cursor-pointer"
              >
                <option value="">All Fuel Types</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#2fa88a] 
              bg-gray-100 hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2"
                >
                  <FiX className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>

            {/* ================= RIGHT ================= */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition ${
                    viewMode === "grid"
                      ? "bg-white text-[#2fa88a] shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BsGrid3X3Gap className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition ${
                    viewMode === "list"
                      ? "bg-white text-[#2fa88a] shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BsListUl className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowAI(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg 
            bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white 
            shadow-lg hover:shadow-xl hover:scale-105 transition-all font-medium text-sm"
              >
                <HiSparkles className="w-5 h-5 animate-pulse" />
                <span className="hidden lg:inline">AI Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== WELCOME BANNER ====================
      <div className="bg-gradient-to-r from-[#1f7a63] via-[#2fa88a] to-[#238b6f] text-white pt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Welcome back, {userName.split(" ")[0] || "there"}! 👋
              </h1>
              <p className="text-white/90 text-xl">
                Discover your perfect ride from our premium collection
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold">{cars.length}</div>
                <div className="text-white/80 text-sm mt-1">Total Cars</div>
              </div>
              <div className="w-px h-16 bg-white/30" />
              <div className="text-center">
                <div className="text-4xl font-bold">{filteredCars.length}</div>
                <div className="text-white/80 text-sm mt-1">Available</div>
              </div>
              <div className="w-px h-16 bg-white/30" />
              <div className="text-center">
                <div className="text-4xl font-bold">{favourites.length}</div>
                <div className="text-white/80 text-sm mt-1">Favourites</div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* ==================== MAIN CONTENT ==================== */}
      <section className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <AiOutlineCar className="text-[#2fa88a]" />
              Available Vehicles
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              Showing {(page - 1) * CARS_PER_PAGE + 1}-
              {Math.min(page * CARS_PER_PAGE, filteredCars.length)} of{" "}
              {filteredCars.length} cars
            </p>
          </div>

          {favourites.length > 0 && (
            <button
              onClick={() => navigate("/buyer/favourites")}
              className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl border-2 
              border-[#2fa88a] text-[#2fa88a] hover:bg-[#2fa88a] hover:text-white 
              transition-all font-semibold"
            >
              <AiOutlineHeart className="w-5 h-5" />
              My Favourites ({favourites.length})
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div
                className="w-20 h-20 border-4 border-[#2fa88a] border-t-transparent 
              rounded-full animate-spin mx-auto mb-6"
              />
              <p className="text-gray-600 font-medium text-lg">
                Loading your dream cars...
              </p>
            </div>
          </div>
        ) : filteredCars.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24">
            <div
              className="w-24 h-24 bg-gray-100 rounded-full flex items-center 
            justify-center mx-auto mb-6"
            >
              <AiOutlineCar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No cars found
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Try adjusting your filters to see more options
            </p>
            <button
              onClick={resetFilters}
              className="px-8 py-3 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] 
              text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Car Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {paginatedCars.map((car) => (
                <div
                  key={car.id}
                  className={`group relative bg-white rounded-2xl shadow-md hover:shadow-2xl 
                  overflow-hidden border border-gray-100 hover:border-[#2fa88a]/30 
                  transition-all duration-300 hover:-translate-y-2 ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                >
                  {/* NEW Badge */}
                  {isNewCar(car.created_at) && (
                    <div
                      className="absolute top-4 left-4 bg-gradient-to-r from-[#1f7a63] 
                    to-[#2fa88a] text-white text-xs px-3 py-1.5 rounded-full font-bold z-10 shadow-lg"
                    >
                      NEW
                    </div>
                  )}

                  {/* Discount Badge */}
                  {car.discount_percent > 0 && (
                    <div
                      className="absolute top-4 right-16 bg-gradient-to-r from-red-500 
                    to-red-600 text-white text-xs px-3 py-1.5 rounded-full font-bold z-10 shadow-lg"
                    >
                      {car.discount_percent}% OFF
                    </div>
                  )}

                  {/* Favourite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavourite(car.id);
                    }}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/95 backdrop-blur-sm 
  rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                  >
                    {favourites.includes(car.id) ? (
                      <AiFillHeart className="w-5 h-5 text-red-500" />
                    ) : (
                      <AiOutlineHeart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                    )}
                  </button>

                  {/* Image */}
                  <div
                    className={`relative overflow-hidden bg-gray-100 ${
                      viewMode === "list"
                        ? "w-64 flex-shrink-0"
                        : "aspect-[4/3]"
                    }`}
                  >
                    {car?.images?.[0]?.url ? (
                      <img
                        src={car.images[0].url}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-110 
                        transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <AiOutlineCar className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/50 
                    to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3
                        className="text-xl font-bold text-gray-900 group-hover:text-[#2fa88a] 
                      transition mb-2"
                      >
                        {car.model} {car.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {car.fuel_type} • {car.year || "2024"} •{" "}
                        {car.transmission || "Automatic"}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-5 pb-5 border-b border-gray-100">
                      {car.discount_percent > 0 ? (
                        <div>
                          <p className="text-3xl font-bold text-[#2fa88a]">
                            KES{" "}
                            {Number(
                              car.final_price ?? car.price,
                            ).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-400 line-through mt-1">
                            KES {Number(car.price).toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold text-[#2fa88a]">
                          KES {Number(car.price ?? 0).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 mt-auto">
                      <button
                        onClick={() => navigate(`/buyer/details/${car.id}`)}
                        className="w-full bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] 
                        text-white py-3 rounded-xl font-semibold hover:shadow-lg 
                        hover:scale-[1.02] transition-all duration-200"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate("/buyer/contact", { state: { car } })}
                        className="w-full border-2 border-[#2fa88a] text-[#2fa88a] py-3 
                        rounded-xl font-semibold hover:bg-[#2fa88a] hover:text-white 
                        transition-all duration-200"
                      >
                        Book Test Drive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                {/* Previous */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`p-2 rounded-lg transition-all ${
                    page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-[#2fa88a] hover:text-white border border-gray-200"
                  }`}
                >
                  <HiChevronLeft className="w-6 h-6" />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                          page === p
                            ? "bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white shadow-lg scale-110"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>

                {/* Next */}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    page === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-[#2fa88a] hover:text-white border border-gray-200"
                  }`}
                >
                  <HiChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Financing Promo */}
        {filteredCars.length > 0 && (
          <div className="mt-20 mb-8">
            <div className="relative group max-w-6xl mx-auto">
              <div
                className="absolute -inset-1 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] 
              rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition"
              />
              <div
                className="relative bg-white rounded-3xl shadow-2xl overflow-hidden 
              border border-gray-100"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center p-10">
                  <div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-4">
                      Need Financing?
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                      Get pre-approved in minutes with our trusted partners.
                      Flexible terms and competitive rates available for all
                      budgets.
                    </p>
                    <button
                      className="px-10 py-4 bg-gradient-to-r from-[#1f7a63] 
                    to-[#2fa88a] text-white rounded-xl font-semibold text-lg 
                    hover:shadow-xl hover:scale-105 transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                  <div className="relative">
                    <img
                      src={financing}
                      alt="Financing"
                      className="w-full h-auto rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==================== AI MODAL ==================== */}
      {showAI && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(10px)",
          }}
          onClick={() => {
            setShowAI(false);
            setAiPrompt("");
            setAiResponse("");
          }}
        >
          <div
            className="relative rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in"
            style={{
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] 
                rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <HiSparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    DuoDrive AI Assistant
                  </h2>
                  <p className="text-sm text-gray-600">
                    Powered by advanced AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAI(false);
                  setAiPrompt("");
                  setAiResponse("");
                }}
                className="text-gray-400 hover:text-gray-600 transition p-2 
                hover:bg-gray-100 rounded-lg"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6 text-base">
              Ask me anything about our inventory! I can help you find the
              perfect car based on your preferences and budget.
            </p>

            {/* Input */}
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl p-4 mb-4 
              focus:border-[#2fa88a] focus:ring-4 focus:ring-[#2fa88a]/20 
              outline-none transition-all resize-none text-base"
              rows="4"
              placeholder="Example: Find me a fuel-efficient SUV under 2M with low mileage and modern features..."
            />

            {/* Submit Button */}
            <button
              onClick={askAI}
              disabled={aiLoading || !aiPrompt.trim()}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                aiLoading || !aiPrompt.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white hover:shadow-xl hover:scale-[1.02]"
              }`}
            >
              {aiLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div
                    className="w-5 h-5 border-2 border-white border-t-transparent 
                  rounded-full animate-spin"
                  />
                  Thinking...
                </span>
              ) : (
                "Ask AI"
              )}
            </button>

            {/* Response */}
            {aiResponse && (
              <div
                className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 
              rounded-xl border-2 border-gray-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <HiSparkles className="w-5 h-5 text-[#2fa88a]" />
                  <p className="font-semibold text-gray-900">AI Response:</p>
                </div>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {aiResponse}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
