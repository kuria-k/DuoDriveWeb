// src/pages/Inventory.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AiOutlineMessage, 
  AiOutlineCar, 
  AiOutlineDashboard,
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineFilter
} from "react-icons/ai";
import { 
  BsFuelPump, 
  BsSpeedometer2, 
  BsGear, 
  BsCalendar,
  BsLightningCharge
} from "react-icons/bs";
import { MdOutlineLocalGasStation } from "react-icons/md";
import { TbManualGearbox, TbAutomaticGearbox } from "react-icons/tb";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import financing from "../assets/finacing.png";
import { getCars } from "../utils/api";

/* ---------------- PREMIUM FILTER COMPONENT ---------------- */
const PremiumFilterSelect = ({ label, name, value, options, onChange, icon: Icon }) => (
  <div className="relative">
    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full appearance-none rounded-xl border border-gray-200 bg-white 
          ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3 text-sm
          focus:border-[#2fa88a] focus:ring-2 focus:ring-[#2fa88a]/20 focus:outline-none
          hover:border-gray-300 transition-all cursor-pointer
          shadow-sm text-gray-700 font-medium`}
      >
        <option value="" className="text-gray-500">All {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-gray-700">
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

/* ---------------- QUICK FILTER CHIPS ---------------- */
const QuickFilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
      ${active 
        ? 'bg-[#2fa88a] text-white shadow-md shadow-[#2fa88a]/30' 
        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#2fa88a] hover:text-[#2fa88a]'
      }`}
  >
    {label}
  </button>
);

/* ---------------- STATS CARD ---------------- */
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
    <div className="w-10 h-10 rounded-lg bg-[#2fa88a]/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-[#2fa88a]" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

/* ---------------- INVENTORY PAGE ---------------- */
const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    model: "",
    fuel: "",
    priceRange: "",
    transmission: "",
    year: "",
  });
  const [quickFilter, setQuickFilter] = useState("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  /* -------- FETCH CARS -------- */
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await getCars();
        setCars(res.data);
      } catch (err) {
        console.error("Failed to fetch cars", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  /* -------- NEW CAR CHECK -------- */
  const isNewCar = (createdAt) => {
    const created = new Date(createdAt);
    return (Date.now() - created) / (1000 * 60 * 60 * 24) <= 7;
  };

  /* -------- STATS CALCULATIONS -------- */
  const stats = useMemo(() => ({
    total: cars.length,
    under2M: cars.filter(c => Number(c.final_price || c.price) < 2000000).length,
    hybrid: cars.filter(c => c.fuel_type === "hybrid" || c.fuel_type === "electric").length,
    newArrivals: cars.filter(c => isNewCar(c.created_at)).length
  }), [cars]);

  /* -------- FILTER LOGIC -------- */
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const price = Number(car.final_price || car.price);
      const year = car.year ? parseInt(car.year) : null;

      // Search query
      const matchesSearch = !searchQuery || 
        car.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.engine?.toLowerCase().includes(searchQuery.toLowerCase());

      // Quick filters
      if (quickFilter === "under2M" && price >= 2000000) return false;
      if (quickFilter === "hybrid" && !["hybrid", "electric"].includes(car.fuel_type)) return false;
      if (quickFilter === "new" && !isNewCar(car.created_at)) return false;

      // Standard filters
      const matchModel = !filters.model || car.model === filters.model;
      const matchFuel = !filters.fuel || car.fuel_type === filters.fuel;
      const matchTransmission = !filters.transmission || car.transmission === filters.transmission;
      const matchYear = !filters.year || year === parseInt(filters.year);
      const matchPrice =
        !filters.priceRange ||
        (filters.priceRange === "<1M" && price < 1_000_000) ||
        (filters.priceRange === "1M-2M" && price >= 1_000_000 && price <= 2_000_000) ||
        (filters.priceRange === "2M-3M" && price > 2_000_000 && price <= 3_000_000) ||
        (filters.priceRange === ">3M" && price > 3_000_000);

      return matchesSearch && matchModel && matchFuel && matchPrice && matchTransmission && matchYear;
    });
  }, [cars, filters, quickFilter, searchQuery]);

  /* -------- UNIQUE VALUES FOR FILTERS -------- */
  const uniqueModels = useMemo(() => [...new Set(cars.map(c => c.model))], [cars]);
  const uniqueYears = useMemo(() => [...new Set(cars.map(c => c.year))].filter(Boolean).sort((a,b) => b - a), [cars]);
  const transmissionOptions = ["automatic", "manual"];

  /* -------- CLEAR FILTERS -------- */
  const clearFilters = () => {
    setFilters({ model: "", fuel: "", priceRange: "", transmission: "", year: "" });
    setQuickFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />

      {/* ---------------- PREMIUM HEADER ---------------- */}
      <section className="pt-28 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Premium Inventory
                </h1>
                <span className="bg-[#2fa88a]/10 text-[#2fa88a] px-3 py-1 rounded-full text-sm font-semibold">
                  {filteredCars.length} Vehicles
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl">
                Discover our curated collection of premium vehicles, each thoroughly inspected and ready for the road.
              </p>
            </div>
            
            {/* AI Assistant Button */}
            {/* <button
              className="flex items-center gap-3 bg-gradient-to-r from-[#238b6f] to-[#2fa88a] 
                text-white px-6 py-3 rounded-xl font-medium shadow-lg 
                hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <div className="relative">
                <AiOutlineMessage className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              </div>
              <span>AI Shopping Assistant</span>
            </button> */}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatCard icon={AiOutlineCar} label="Total Vehicles" value={stats.total} />
            <StatCard icon={AiOutlineDashboard} label="Under 2M KES" value={stats.under2M} />
            <StatCard icon={BsLightningCharge} label="Hybrid/Electric" value={stats.hybrid} />
            <StatCard icon={BsCalendar} label="New Arrivals" value={stats.newArrivals} />
          </div>
        </div>
      </section>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <section className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* ---------------- SEARCH & QUICK FILTERS ---------------- */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <AiOutlineSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by model, make, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl 
                  focus:border-[#2fa88a] focus:ring-2 focus:ring-[#2fa88a]/20 focus:outline-none
                  shadow-sm text-gray-700 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <AiOutlineClose className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 
                border border-gray-200 rounded-xl bg-white shadow-sm"
            >
              <AiOutlineFilter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filters</span>
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <QuickFilterChip 
              label="All Vehicles" 
              active={quickFilter === "all"} 
              onClick={() => setQuickFilter("all")} 
            />
            <QuickFilterChip 
              label="Under 2M KES" 
              active={quickFilter === "under2M"} 
              onClick={() => setQuickFilter("under2M")} 
            />
            <QuickFilterChip 
              label="Hybrid/Electric" 
              active={quickFilter === "hybrid"} 
              onClick={() => setQuickFilter("hybrid")} 
            />
            <QuickFilterChip 
              label="New Arrivals" 
              active={quickFilter === "new"} 
              onClick={() => setQuickFilter("new")} 
            />
            {(quickFilter !== "all" || Object.values(filters).some(Boolean) || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-500 
                  hover:text-gray-700 hover:bg-gray-100 transition-all whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>

          {/* ---------------- PREMIUM FILTER BAR ---------------- */}
          <div className={`bg-white rounded-2xl border border-gray-200 p-6 mb-10 shadow-sm
            ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Refine Your Search</h3>
              <span className="text-sm text-gray-500">{filteredCars.length} vehicles match your criteria</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <PremiumFilterSelect
                label="MAKE"
                name="model"
                value={filters.model}
                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                options={uniqueModels}
                icon={AiOutlineCar}
              />

              <PremiumFilterSelect
                label="PRICE RANGE"
                name="priceRange"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                options={["<1M", "1M-2M", "2M-3M", ">3M"]}
                icon={AiOutlineDashboard}
              />

              <PremiumFilterSelect
                label="FUEL TYPE"
                name="fuel"
                value={filters.fuel}
                onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                options={["petrol", "diesel", "hybrid", "electric"]}
                icon={BsFuelPump}
              />

              <PremiumFilterSelect
                label="TRANSMISSION"
                name="transmission"
                value={filters.transmission}
                onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                options={transmissionOptions}
                icon={filters.transmission === "automatic" ? TbAutomaticGearbox : TbManualGearbox}
              />

              <PremiumFilterSelect
                label="YEAR"
                name="year"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                options={uniqueYears}
                icon={BsCalendar}
              />
            </div>
          </div>

          {/* ---------------- PREMIUM FINANCING BANNER ---------------- */}
          <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3')] 
              bg-cover bg-center opacity-20"></div>
            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-[#2fa88a]/20 rounded-xl flex items-center justify-center">
                  <img src={financing} alt="Financing" className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Flexible Financing Available</h4>
                  <p className="text-gray-300 text-sm">Rates as low as 9.9% APR. Instant pre-approval.</p>
                </div>
              </div>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-medium 
                hover:shadow-lg hover:scale-105 transition-all">
                Apply Now
              </button>
            </div>
          </div>

          {/* ---------------- PREMIUM VEHICLE GRID - 4 COLUMNS ---------------- */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AiOutlineCar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
              <button
                onClick={clearFilters}
                className="bg-[#2fa88a] text-white px-6 py-3 rounded-xl font-medium 
                  hover:bg-[#238b6f] transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="group relative bg-white rounded-2xl overflow-hidden 
                    border border-gray-200 hover:border-[#2fa88a]/30
                    shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-48">
                    {car.images?.length > 0 ? (
                      <img
                        src={car.images[0].url}
                        alt={car.name}
                        className="w-full h-full object-cover 
                          transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 
                        flex items-center justify-center">
                        <AiOutlineCar className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {isNewCar(car.created_at) && (
                        <span className="bg-gradient-to-r from-[#2fa88a] to-[#238b6f] 
                          text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                          NEW
                        </span>
                      )}
                      {car.discount_percent > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-red-600 
                          text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                          {car.discount_percent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => navigate(`/cardetails/${car.id}`)}
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg 
                          font-medium hover:bg-gray-100 transition-all 
                          transform translate-y-4 group-hover:translate-y-0 
                          opacity-0 group-hover:opacity-100 duration-300"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Title & Year */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {car.model} {car.name}
                      </h3>
                      {car.year && (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {car.year}
                        </span>
                      )}
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                      {car.fuel_type && (
                        <div className="flex items-center gap-1">
                          <MdOutlineLocalGasStation className="w-3.5 h-3.5" />
                          <span className="capitalize">{car.fuel_type}</span>
                        </div>
                      )}
                      {car.transmission && (
                        <div className="flex items-center gap-1">
                          {car.transmission === "automatic" ? 
                            <TbAutomaticGearbox className="w-3.5 h-3.5" /> : 
                            <TbManualGearbox className="w-3.5 h-3.5" />
                          }
                          <span className="capitalize">{car.transmission}</span>
                        </div>
                      )}
                      {car.mileage && (
                        <div className="flex items-center gap-1">
                          <BsSpeedometer2 className="w-3.5 h-3.5" />
                          <span>{car.mileage.toLocaleString()} km</span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      {car.discount_percent > 0 ? (
                        <div>
                          <span className="text-2xl font-bold text-[#2fa88a]">
                            KES {Number(car.final_price).toLocaleString()}
                          </span>
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            KES {Number(car.price).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-[#2fa88a]">
                          KES {Number(car.price).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/cardetails/${car.id}`)}
                        className="flex-1 bg-gradient-to-r from-[#2fa88a] to-[#238b6f] 
                          text-white py-2.5 rounded-lg text-sm font-semibold
                          hover:shadow-lg hover:shadow-[#2fa88a]/30 
                          transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate("/contact", { state: { car } })}
                        className="flex-1 border-2 border-[#2fa88a] text-[#2fa88a] 
                          py-2.5 rounded-lg text-sm font-semibold
                          hover:bg-[#2fa88a] hover:text-white 
                          transition-all duration-300"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Inventory;
