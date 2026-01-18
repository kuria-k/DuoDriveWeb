import React, { useEffect, useState } from "react";
import { FaCar, FaDollarSign, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const now = new Date().toLocaleString();
  const [location, setLocation] = useState("Detecting location...");

  // Get user's location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use OpenStreetMap Nominatim API for reverse geocoding
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.state ||
            "";
          const country = data.address.country || "";

          setLocation(`${city}, ${country}`);
        } catch {
          setLocation("Location unavailable");
        }
      },
      () => {
        setLocation("Location denied");
      }
    );
  }, []);

  const popularModels = [
    { name: "Toyota Camry", value: 80 },
    { name: "Honda Civic", value: 65 },
    { name: "BMW X5", value: 45 },
    { name: "Tesla Model 3", value: 70 },
  ];

  const brandStockData = [
    { name: "Toyota", value: 35, color: "#1a4d2e" },
    { name: "Honda", value: 28, color: "#2d6a4f" },
    { name: "BMW", value: 22, color: "#40916c" },
    { name: "Tesla", value: 25, color: "#52b788" },
    { name: "Mercedes", value: 18, color: "#74c69d" },
  ];

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <FaClock style={{ color: "#2fa88a" }} /> {now}
          <span className="text-gray-300">|</span>
          <FaMapMarkerAlt style={{ color: "#2fa88a" }} /> {location}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Cars in Stock" value="128" icon={FaCar} />
        <StatCard title="Revenue Generated" value="KSH 2,450,000" icon={FaDollarSign} />
        <StatCard title="Cars Sold This Month" value="42" icon={FaCar} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Stock Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Stock by Brand</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={brandStockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {brandStockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Models Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Popular Models</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={popularModels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2fa88a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-shadow border border-gray-200">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: "#e8f5e9", color: "#2fa88a" }}>
        <Icon />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-black">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;


