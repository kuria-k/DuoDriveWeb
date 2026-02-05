// src/pages/Inventory.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import financing from "../assets/finacing.png";
import { getCars } from "../utils/api";

/* ---------------- FILTER SELECT ---------------- */
const FilterSelect = ({ label, name, value, options, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 
      text-sm focus:border-[#2fa88a] focus:ring-2 focus:ring-[#2fa88a]/30"
    >
      <option value="">All</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
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
  });

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
    return (Date.now() - created) / (1000 * 60 * 60 * 24) <= 3;
  };

  /* -------- FILTER LOGIC -------- */
  const filteredCars = cars.filter((car) => {
    const price = Number(car.final_price || car.price);

    const matchModel = !filters.model || car.model === filters.model;
    const matchFuel = !filters.fuel || car.fuel_type === filters.fuel;
    const matchPrice =
      !filters.priceRange ||
      (filters.priceRange === "<1M" && price < 1_000_000) ||
      (filters.priceRange === "1M-2M" &&
        price >= 1_000_000 &&
        price <= 2_000_000) ||
      (filters.priceRange === "2M-3M" &&
        price > 2_000_000 &&
        price <= 3_000_000) ||
      (filters.priceRange === ">3M" && price > 3_000_000);

    return matchModel && matchFuel && matchPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex flex-col">
      <Navbar />

      {/* ---------------- PAGE HEADER ---------------- */}
      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Vehicle Inventory
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Browse premium imports, trusted used vehicles, and exclusive deals —
            delivered anywhere in Kenya.
          </p>
        </div>
      </section>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <section className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* ---------------- FILTER SIDEBAR ---------------- */}
          <aside
            className="md:col-span-1 sticky top-28 h-fit rounded-2xl bg-white/80 backdrop-blur-xl 
          border border-gray-200 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Refine Results
              </h3>

              <button
                className="flex items-center gap-2 rounded-full 
                bg-gradient-to-r from-[#238b6f] to-[#2fa88a] 
                px-4 py-2 text-xs font-semibold text-white shadow hover:scale-105 transition"
              >
                <AiOutlineMessage className="w-4 h-4" />
                Ask AI
              </button>
            </div>

            <div className="space-y-5">
              <FilterSelect
                label="Make"
                name="model"
                value={filters.model}
                onChange={(e) =>
                  setFilters({ ...filters, model: e.target.value })
                }
                options={[...new Set(cars.map((c) => c.model))]}
              />

              <FilterSelect
                label="Price Range (KES)"
                name="priceRange"
                value={filters.priceRange}
                onChange={(e) =>
                  setFilters({ ...filters, priceRange: e.target.value })
                }
                options={["<1M", "1M-2M", "2M-3M", ">3M"]}
              />

              <FilterSelect
                label="Fuel Type"
                name="fuel"
                value={filters.fuel}
                onChange={(e) =>
                  setFilters({ ...filters, fuel: e.target.value })
                }
                options={["petrol", "diesel", "hybrid", "electric"]}
              />
            </div>

            {/* Promo */}
            <div className="mt-10 relative overflow-hidden rounded-xl shadow-lg">
              <img src={financing} alt="Financing" className="w-full" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                <p className="text-white font-semibold text-sm">
                  Flexible Financing Available
                </p>
              </div>
            </div>
          </aside>

          {/* ---------------- LISTINGS ---------------- */}
          <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="group relative bg-white rounded-2xl overflow-hidden 
        border border-gray-100 shadow-md hover:shadow-2xl 
        transition-all duration-300"
                >
                  {/* NEW & DISCOUNT BADGES */}
                  {isNewCar(car.created_at) && (
                    <div
                      className="absolute top-3 left-3 z-10 
          bg-[#2fa88a] text-white text-xs px-3 py-1 rounded-full font-bold"
                    >
                      NEW
                    </div>
                  )}

                  {car.discount_percent > 0 && (
                    <div
                      className="absolute top-3 right-3 z-10 
          bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold"
                    >
                      {car.discount_percent}% OFF
                    </div>
                  )}

                  {/* IMAGE */}
                  {car.images?.length > 0 ? (
                    <div className="overflow-hidden">
                      <img
                        src={car.images[0].url}
                        alt={car.name}
                        className="w-full h-56 object-cover 
              transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                      No Image
                    </div>
                  )}

                  {/* CONTENT (UNCHANGED STRUCTURE) */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900">
                      {car.model} {car.name}
                    </h3>

                    <p className="text-2xl font-bold mt-3 text-[#2fa88a]">
                      {car.discount_percent > 0 ? (
                        <>
                          KES {Number(car.final_price).toLocaleString()}
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            KES {Number(car.price).toLocaleString()}
                          </span>
                          <br />
                        </>
                      ) : (
                        `KES ${Number(car.price).toLocaleString()}`
                      )}
                    </p>

                    {/* ACTION BUTTONS (SAME CONTENT) */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/cardetails/${car.id}`)}
                        className="flex-1 bg-[#2fa88a] text-white py-2 rounded-lg 
              font-medium hover:opacity-90 transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate("/contact", { state: { car } })}
                        className="flex-1 border-2 border-[#2fa88a] text-[#2fa88a] py-2 
              rounded-lg font-medium hover:bg-gray-50 transition"
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Inventory;
