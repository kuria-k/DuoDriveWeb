import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
      
      {/* Make */}
      <select className="border border-gray-200 rounded-xl px-4 py-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1f7a63] transition">
        <option>All Makes</option>
        <option>Toyota</option>
        <option>Nissan</option>
        <option>Mercedes</option>
      </select>

      {/* Price */}
      <select className="border border-gray-200 rounded-xl px-4 py-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1f7a63] transition">
        <option>Price Range</option>
        <option>Below 2M</option>
        <option>2M - 5M</option>
        <option>5M+</option>
      </select>

      {/* Fuel Type */}
      <select className="border border-gray-200 rounded-xl px-4 py-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1f7a63] transition">
        <option>Fuel Type</option>
        <option>Petrol</option>
        <option>Diesel</option>
        <option>Hybrid</option>
      </select>

      {/* Search Button */}
      <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <Search size={20} />
        Search
      </button>
    </div>
  );
};

export default SearchBar;

