// src/pages/buyer/Inventory.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/footer";
import financing from "../../assets/finacing.png";
import {
  getCars,
  toggleFavourite,
  getFavourites,
  createFilterHistory,
} from "../../utils/api";

import { 
  AiOutlineCar, 
  AiOutlineHeart, 
  AiFillHeart,
  AiOutlineSafety,
  AiOutlineThunderbolt,
  AiOutlineCheckCircle,
  AiOutlineStar
} from "react-icons/ai";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { 
  HiSparkles, 
  HiChevronLeft, 
  HiChevronRight,
  HiOutlineLightningBolt 
} from "react-icons/hi";
import { BsGrid3X3Gap, BsListUl, BsFuelPump, BsGear, BsCalendar } from "react-icons/bs";
import { MdOutlineLocalGasStation, MdSpeed, MdSecurity } from "react-icons/md";
import { TbAutomaticGearbox, TbManualGearbox } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";

/* ================= CONFIG ================= */
const CARS_PER_PAGE = 16;

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
  return (now - created) / (1000 * 60 * 60 * 24) <= 7;
};

const saveFilterHistory = async (newFilters) => {
  try {
    await createFilterHistory(newFilters);
  } catch (err) {
    console.error("Failed to save filter history:", err);
  }
};

/* ================= COMPONENTS ================= */
const PremiumStatCard = ({ icon: Icon, label, value, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 p-5 shadow-lg hover:shadow-xl transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1f7a63]/10 to-[#2fa88a]/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#2fa88a]" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className="text-xs text-green-600 font-medium mt-1">↑ {trend} from last week</p>
        )}
      </div>
    </div>
  </motion.div>
);

const PremiumFilterSelect = ({ label, value, options, onChange, icon: Icon }) => (
  <div className="relative">
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none pl-10 pr-10 py-3 bg-white border-2 border-gray-100 
          rounded-xl text-sm font-medium text-gray-700 
          hover:border-[#2fa88a]/30 focus:border-[#2fa88a] 
          focus:ring-4 focus:ring-[#2fa88a]/10 
          transition-all outline-none cursor-pointer"
      >
        {options}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <FiChevronDown className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  </div>
);

const QuickFilterChip = ({ label, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
      ${active 
        ? 'bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white shadow-lg shadow-[#2fa88a]/30' 
        : 'bg-white text-gray-600 border-2 border-gray-100 hover:border-[#2fa88a] hover:text-[#2fa88a]'
      }`}
  >
    {label}
  </motion.button>
);

const Inventory = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  /* ================= STATE ================= */
  const [cars, setCars] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [quickFilter, setQuickFilter] = useState("all");

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

  const userName = sessionStorage.getItem("userName") || "there";
  const userId = sessionStorage.getItem("userId") || "";
  const userEmail = sessionStorage.getItem("userEmail") || "";
  const userPhone = sessionStorage.getItem("userPhone") || "";

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
    } catch (err) {
      console.error("❌ Cars load failed:", err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavourites = async () => {
    if (!userId) return;
    try {
      const favs = await getFavourites(userId);
      setFavourites(favs.map((f) => f.car.id));
    } catch (err) {
      console.error("Favourites load failed:", err);
      const saved = sessionStorage.getItem(`favourites_${userId}`);
      if (saved) setFavourites(JSON.parse(saved));
    }
  };

  /* ================= FILTER ================= */
  const filteredCars = useMemo(() => {
    if (!Array.isArray(cars)) return [];

    return cars.filter((car) => {
      if (!car) return false;
      const price = Number(car.final_price ?? car.price ?? 0);

      // Quick filters
      if (quickFilter === "under2M" && price >= 2000000) return false;
      if (quickFilter === "hybrid" && !["hybrid", "electric"].includes(car.fuel_type)) return false;
      if (quickFilter === "new" && !isNewCar(car.created_at)) return false;

      if (filters.model && car.model !== filters.model) return false;
      if (filters.fuel && car.fuel_type !== filters.fuel) return false;
      if (filters.priceRange && !PRICE_FILTERS[filters.priceRange]?.(price)) return false;

      return true;
    });
  }, [cars, filters, quickFilter]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / CARS_PER_PAGE));
  const paginatedCars = filteredCars.slice(
    (page - 1) * CARS_PER_PAGE,
    page * CARS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= FAVOURITES ================= */
  const handleToggleFavourite = async (carId) => {
    setFavourites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );

    if (userId) {
      const updatedFavourites = favourites.includes(carId)
        ? favourites.filter((id) => id !== carId)
        : [...favourites, carId];
      sessionStorage.setItem(
        `favourites_${userId}`,
        JSON.stringify(updatedFavourites)
      );
    }

    try {
      await toggleFavourite(carId);
    } catch (err) {
      console.error("Toggle favourite failed:", err);
      setFavourites((prev) =>
        prev.includes(carId)
          ? prev.filter((id) => id !== carId)
          : [...prev, carId]
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
      setAiResponse("Sorry, I couldn't process your request. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const resetFilters = () => {
    const cleared = { model: "", priceRange: "", fuel: "" };
    setFilters(cleared);
    setQuickFilter("all");
    setPage(1);
    saveFilterHistory(cleared);
  };

  const hasActiveFilters = filters.model || filters.fuel || filters.priceRange || quickFilter !== "all";

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      
      {/* ==================== HERO SECTION ==================== */}
      

      {/* ==================== STICKY FILTER BAR ==================== */}
      <div 
        // className="sticky z-40 bg-white/80 backdrop-blur-xl border-y border-gray-100 shadow-lg"
         className="bg-white/80 backdrop-blur-xl border-y border-gray-100 shadow-lg"
        style={{ top: "var(--buyer-nav-height)" }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">

    {/* ================= HEADER ROW ================= */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-b border-gray-200">

      {/* Left: Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Refine Your Search
        </h2>
        <p className="text-sm text-gray-500">
          Find the perfect vehicle that matches your needs
        </p>
      </div>

      {/* Right: View Toggle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-lg transition ${
              viewMode === "grid"
                ? "bg-white text-[#2fa88a] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BsGrid3X3Gap className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-lg transition ${
              viewMode === "list"
                ? "bg-white text-[#2fa88a] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BsListUl className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    {/* ================= FILTER ROW ================= */}
    <div className="py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <PremiumFilterSelect
          label="Make"
          value={filters.model}
          onChange={(e) => {
            const newFilters = { ...filters, model: e.target.value };
            setFilters(newFilters);
            setPage(1);
            saveFilterHistory(newFilters);
          }}
          icon={AiOutlineCar}
          options={
            <>
              <option value="">All Makes</option>
              {[...new Set(cars.map((c) => c?.model).filter(Boolean))].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </>
          }
        />

        <PremiumFilterSelect
          label="Price Range"
          value={filters.priceRange}
          onChange={(e) => {
            const newFilters = { ...filters, priceRange: e.target.value };
            setFilters(newFilters);
            setPage(1);
            saveFilterHistory(newFilters);
          }}
          icon={AiOutlineStar}
          options={
            <>
              <option value="">All Prices</option>
              <option value="<1M">Under 1M KES</option>
              <option value="1M-2M">1M – 2M KES</option>
              <option value="2M-3M">2M – 3M KES</option>
              <option value=">3M">Above 3M KES</option>
            </>
          }
        />

        <PremiumFilterSelect
          label="Fuel Type"
          value={filters.fuel}
          onChange={(e) => {
            const newFilters = { ...filters, fuel: e.target.value };
            setFilters(newFilters);
            setPage(1);
            saveFilterHistory(newFilters);
          }}
          icon={BsFuelPump}
          options={
            <>
              <option value="">All Fuel Types</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </>
          }
        />

        {/* Reset Button */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="w-full h-[52px] border border-gray-300 
              rounded-xl text-sm font-medium text-gray-700 
              hover:bg-gray-50 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>

    {/* ================= QUICK FILTERS ================= */}
    <div className="pb-6 flex flex-wrap gap-3">
      <QuickFilterChip 
        label="All Vehicles" 
        active={quickFilter === "all"} 
        onClick={() => { setQuickFilter("all"); setPage(1); }} 
      />
      <QuickFilterChip 
        label="Under 2M KES" 
        active={quickFilter === "under2M"} 
        onClick={() => { setQuickFilter("under2M"); setPage(1); }} 
      />
      <QuickFilterChip 
        label="Hybrid / Electric" 
        active={quickFilter === "hybrid"} 
        onClick={() => { setQuickFilter("hybrid"); setPage(1); }} 
      />
      <QuickFilterChip 
        label="New Arrivals" 
        active={quickFilter === "new"} 
        onClick={() => { setQuickFilter("new"); setPage(1); }} 
      />
    </div>

  </div>
</div>

      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <section className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-b from-[#1f7a63] to-[#2fa88a] rounded-full" />
                Premium Collection
              </h2>
              <p className="text-gray-600 mt-2">
                Showing <span className="font-semibold text-[#2fa88a]">{(page - 1) * CARS_PER_PAGE + 1}</span> - 
                <span className="font-semibold text-[#2fa88a]">{Math.min(page * CARS_PER_PAGE, filteredCars.length)}</span> of 
                <span className="font-semibold text-[#2fa88a]"> {filteredCars.length}</span> vehicles
              </p>
            </div>

            {favourites.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/buyer/favourites")}
                className="hidden md:flex items-center gap-3 px-6 py-3 rounded-xl 
                  bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white 
                  shadow-lg shadow-[#2fa88a]/30 hover:shadow-xl 
                  transition-all font-semibold"
              >
                <AiFillHeart className="w-5 h-5" />
                My Favourites ({favourites.length})
              </motion.button>
            )}
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-[#2fa88a]/20 border-t-[#2fa88a] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AiOutlineCar className="w-10 h-10 text-[#2fa88a]/50" />
                  </div>
                </div>
                <p className="text-gray-600 font-medium text-lg mt-6">
                  Loading your dream cars...
                </p>
              </div>
            </div>
          ) : filteredCars.length === 0 ? (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-white rounded-3xl border-2 border-gray-100 shadow-xl"
            >
              <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AiOutlineCar className="w-14 h-14 text-gray-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                No vehicles found
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                We couldn't find any vehicles matching your criteria. Try adjusting your filters.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetFilters}
                className="px-8 py-4 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] 
                  text-white rounded-xl font-semibold text-lg shadow-lg 
                  hover:shadow-xl transition-all"
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Car Grid/List */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode + page}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {paginatedCars.map((car, index) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                        overflow-hidden border border-gray-100 hover:border-[#2fa88a]/30 
                        transition-all duration-500 hover:-translate-y-2 ${
                        viewMode === "list" ? "flex flex-row" : ""
                      }`}
                    >
                      {/* NEW Badge */}
                      {isNewCar(car.created_at) && (
                        <div className="absolute top-4 left-4 z-20">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] rounded-full blur opacity-70" />
                            <div className="relative bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] 
                              text-white text-xs px-4 py-1.5 rounded-full font-bold">
                              NEW ARRIVAL
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Discount Badge */}
                      {car.discount_percent > 0 && (
                        <div className="absolute top-4 right-16 z-20">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur opacity-70" />
                            <div className="relative bg-gradient-to-r from-red-500 to-red-600 
                              text-white text-xs px-4 py-1.5 rounded-full font-bold">
                              {car.discount_percent}% OFF
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Favourite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavourite(car.id);
                        }}
                        className="absolute top-4 right-4 z-20 p-2.5 bg-white/95 backdrop-blur-sm 
                          rounded-full shadow-lg hover:shadow-xl transition-all"
                      >
                        {favourites.includes(car.id) ? (
                          <AiFillHeart className="w-5 h-5 text-red-500" />
                        ) : (
                          <AiOutlineHeart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                        )}
                      </motion.button>

                      {/* Image Container */}
                      <div
                        className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${
                          viewMode === "list"
                            ? "w-72 flex-shrink-0"
                            : "aspect-[4/3]"
                        }`}
                      >
                        {car?.images?.[0]?.url ? (
                          <>
                            <img
                              src={car.images[0].url}
                              alt={car.name}
                              className="w-full h-full object-cover group-hover:scale-110 
                                transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Quick View Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 
                              transition-all duration-500 transform group-hover:scale-100 scale-90">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/buyer/details/${car.id}`)}
                                className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 
                                  rounded-xl font-semibold shadow-2xl hover:shadow-3xl 
                                  transition-all border border-white/50"
                              >
                                Quick View
                              </motion.button>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <AiOutlineCar className="w-20 h-20 text-gray-400" />
                          </div>
                        )}

                        {/* Status Badge */}
                        {car.status && (
                          <div className="absolute bottom-4 left-4">
                            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm
                              ${car.status === "available" 
                                ? "bg-[#2fa88a]/90 text-white border border-white/30" 
                                : car.status === "reserved"
                                  ? "bg-yellow-500/90 text-white border border-white/30"
                                  : car.status === "sold"
                                    ? "bg-gray-800/90 text-white border border-white/30"
                                    : "bg-gray-600/90 text-white border border-white/30"
                              }`}>
                              {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2fa88a] 
                              transition-colors">
                              {car.model} {car.name}
                            </h3>
                          </div>

                          {/* Specs Grid */}
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            {car.fuel_type && (
                              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                                <BsFuelPump className="w-4 h-4 text-gray-600 mb-1" />
                                <span className="text-xs text-gray-600 capitalize">{car.fuel_type}</span>
                              </div>
                            )}
                            {car.transmission && (
                              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                                {car.transmission === "automatic" ? (
                                  <TbAutomaticGearbox className="w-4 h-4 text-gray-600 mb-1" />
                                ) : (
                                  <TbManualGearbox className="w-4 h-4 text-gray-600 mb-1" />
                                )}
                                <span className="text-xs text-gray-600 capitalize">{car.transmission}</span>
                              </div>
                            )}
                            {car.year && (
                              <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                                <BsCalendar className="w-4 h-4 text-gray-600 mb-1" />
                                <span className="text-xs text-gray-600">{car.year}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="mb-5 pb-5 border-b border-gray-100">
                          {car.discount_percent > 0 ? (
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-[#2fa88a]">
                                  KES {Number(car.final_price ?? car.price).toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  KES {Number(car.price).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-green-600 font-medium mt-1">
                                Save KES {(Number(car.price) - Number(car.final_price ?? car.price)).toLocaleString()}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <span className="text-3xl font-bold text-[#2fa88a]">
                                KES {Number(car.price ?? 0).toLocaleString()}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">Drive away price</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 mt-auto">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/buyer/details/${car.id}`)}
                            className="w-full bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] 
                              text-white py-3.5 rounded-xl font-semibold shadow-lg 
                              shadow-[#2fa88a]/30 hover:shadow-xl transition-all"
                          >
                            View Details
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              navigate("/buyer/contact", {
                                state: {
                                  car,
                                  buyer_name: userName,
                                },
                              })
                            }
                            className="w-full border-2 border-[#2fa88a] text-[#2fa88a] 
                              py-3.5 rounded-xl font-semibold hover:bg-[#2fa88a] 
                              hover:text-white transition-all"
                          >
                            Book Test Drive
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-16 flex items-center justify-center gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`p-3 rounded-xl transition-all ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-[#2fa88a] hover:text-white border-2 border-gray-100 shadow-lg"
                    }`}
                  >
                    <HiChevronLeft className="w-5 h-5" />
                  </motion.button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <motion.button
                        key={p}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(p)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                          page === p
                            ? "bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white shadow-lg shadow-[#2fa88a]/30 scale-110"
                            : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-100"
                        }`}
                      >
                        {p}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`p-3 rounded-xl transition-all ${
                      page === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-[#2fa88a] hover:text-white border-2 border-gray-100 shadow-lg"
                    }`}
                  >
                    <HiChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </>
          )}

          {/* Financing Promo */}
          {filteredCars.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-20 mb-8"
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] 
                  rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition" />
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden 
                  border border-gray-100">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="p-10 lg:p-12">
                      <div className="inline-flex items-center gap-2 px-4 py-2 
                        bg-gradient-to-r from-[#1f7a63]/10 to-[#2fa88a]/10 rounded-full mb-6">
                        <AiOutlineThunderbolt className="w-4 h-4 text-[#2fa88a]" />
                        <span className="text-sm font-semibold text-[#2fa88a]">
                          Special Financing Offer
                        </span>
                      </div>
                      <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Drive Today, 
                        <span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent block">
                          Pay Tomorrow
                        </span>
                      </h3>
                      <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        Get pre-approved in minutes with rates starting at 9.9% APR. 
                        Flexible terms up to 72 months available for qualified buyers.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.a
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href="/buyer/financing"
                          className="px-8 py-4 bg-gradient-to-r from-[#1f7a63] 
                            to-[#2fa88a] text-white rounded-xl font-semibold text-lg 
                            shadow-lg hover:shadow-xl transition-all text-center"
                        >
                          Apply Now
                        </motion.a>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-8 py-4 bg-white border-2 border-gray-200 
                            text-gray-700 rounded-xl font-semibold text-lg 
                            hover:border-[#2fa88a] hover:text-[#2fa88a] 
                            transition-all"
                        >
                          Calculate Payment
                        </motion.button>
                      </div>
                    </div>
                    <div className="relative h-full min-h-[400px] hidden lg:block">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1f7a63]/20 to-[#2fa88a]/20" />
                      <img
                        src={financing}
                        alt="Financing"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                          <div className="flex items-center gap-4">
                            <MdSecurity className="w-8 h-8 text-[#2fa88a]" />
                            <div>
                              <p className="font-semibold text-gray-900">100% Secure Application</p>
                              <p className="text-sm text-gray-600">Your information is encrypted</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ==================== LUXURY AI MODAL ==================== */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(12px)",
            }}
            onClick={() => {
              setShowAI(false);
              setAiPrompt("");
              setAiResponse("");
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] 
                      rounded-2xl blur-lg opacity-70" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] 
                      rounded-2xl flex items-center justify-center shadow-xl">
                      <HiSparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      DuoDrive AI Assistant
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Online • Ready to help
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setShowAI(false);
                    setAiPrompt("");
                    setAiResponse("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition p-2 
                    hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-6 h-6" />
                </motion.button>
              </div>

              <p className="text-gray-600 mb-6 text-base bg-gray-50 p-4 rounded-xl">
                ✨ I'm your personal car shopping assistant. Tell me what you're looking for - 
                budget, preferences, features - and I'll help find your perfect match.
              </p>

              {/* Input Area */}
              <div className="relative mb-4">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-5 pr-24
                    focus:border-[#2fa88a] focus:ring-4 focus:ring-[#2fa88a]/20 
                    outline-none transition-all resize-none text-base"
                  rows="4"
                  placeholder="Example: Find me a fuel-efficient SUV under 2M with low mileage and modern features..."
                />
                <div className="absolute bottom-5 right-5 text-xs text-gray-400">
                  {aiPrompt.length}/500
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={askAI}
                disabled={aiLoading || !aiPrompt.trim()}
                className={`w-full py-5 rounded-xl font-semibold text-lg transition-all 
                  flex items-center justify-center gap-3 ${
                  aiLoading || !aiPrompt.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {aiLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent 
                      rounded-full animate-spin" />
                    Analyzing your request...
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-5 h-5" />
                    Get AI Recommendations
                  </>
                )}
              </motion.button>

              {/* Response */}
              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 
                      rounded-xl border-2 border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] 
                        rounded-lg flex items-center justify-center">
                        <HiSparkles className="w-4 h-4 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900">AI Recommendation</p>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {aiResponse}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggested Prompts */}
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "SUV under 2.5M",
                    "Hybrid with sunroof",
                    "Low mileage automatic",
                    "7-seater family car"
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setAiPrompt(prompt)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 
                        rounded-lg text-sm text-gray-700 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    
    </div>
  );
};

export default Inventory;