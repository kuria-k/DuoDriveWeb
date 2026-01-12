import Navbar from "../components/navbar";
import CarCard from "../components/carcard";
import Footer from "../components/footer";
import { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";

const cars = [
  { id: 1, make: "Toyota", price: "$20,000", fuel: "Petrol" },
  { id: 2, make: "Honda", price: "$18,500", fuel: "Diesel" },
  { id: 3, make: "BMW", price: "$35,000", fuel: "Hybrid" },
  { id: 4, make: "Mercedes", price: "$40,000", fuel: "Electric" },
];

const FilterSelect = ({ label, options }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold mb-2">{label}</label>
    <select className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500">
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const Inventory = () => {
  // ✅ Move state inside component
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    budget: "",
    size: "",
    fuel: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("AI Recommendation Input:", formData);
    // Here you would integrate with AI recommendation system
    setOpen(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          {/* FILTERS */}
          <aside className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative">
            <h3 className="font-bold text-xl mb-6 text-gray-800">Filter Cars</h3>
            <FilterSelect label="Make" options={["Toyota", "Honda", "BMW", "Mercedes"]} />
            <FilterSelect label="Price Range" options={["<$20k", "$20k-$30k", "$30k-$40k", ">$40k"]} />
            <FilterSelect label="Fuel Type" options={["Petrol", "Diesel", "Hybrid", "Electric"]} />
            <button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-2 rounded-lg font-semibold shadow hover:scale-105 transition">
              Apply Filters
            </button> <br /> <br />

            {/* Chat Icon */}
<button
  onClick={() => setOpen(true)}
  className="absolute mt-[24px] right-4 flex items-center gap-2 px-4 py-2 
             rounded-full bg-gradient-to-r from-[#238b6f] to-[#2fa88a] 
             text-white shadow-lg hover:shadow-xl hover:scale-105 
             transition-all duration-300"
  aria-label="AI Recommendation"
>
  <AiOutlineMessage className="w-5 h-5 animate-pulse" />
  <span className="text-sm font-semibold tracking-wide">Duo Drive AI</span>
</button>

            
          </aside>

          {/* LISTINGS */}
          <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Glassmorphic Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-white relative">
            <h2 className="text-2xl font-bold mb-6 text-center">
              AI Car Recommendation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Budget */}
              <div>
                <label className="block mb-2 font-medium">Budget (USD)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] text-black"
                  placeholder="e.g. 25000"
                />
              </div>

              {/* Car Size */}
              <div>
                <label className="block mb-2 font-medium">Car Size</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] text-black"
                >
                  <option value="">Select size</option>
                  <option value="Compact">Compact</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              {/* Fuel Preference */}
              <div>
                <label className="block mb-2 font-medium">Fuel Preference</label>
                <select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/30 border border-white/40 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] text-black"
                >
                  <option value="">Select fuel type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#2fa88a] text-white font-semibold py-3 rounded-lg hover:scale-105 transition"
              >
                Get Recommendation
              </button>
            </form>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-red-400"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

