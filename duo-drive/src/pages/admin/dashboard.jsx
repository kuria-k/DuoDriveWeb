// import React, { useEffect, useState } from "react";
// import { FaCar, FaDollarSign, FaClock, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   Legend,
// } from "recharts";
// import { getCars, getSales, getExpenses, getContacts } from "../../utils/api";

// const Dashboard = () => {
//   const now = new Date().toLocaleString();
//   const [location, setLocation] = useState("Detecting location...");
//   const [cars, setCars] = useState([]);
//   const [sales, setSales] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Get user's location on mount
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setLocation("Location not supported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//           );
//           const data = await res.json();
//           const city = data.address.city || data.address.town || data.address.state || "";
//           const country = data.address.country || "";
//           setLocation(`${city}, ${country}`);
//         } catch {
//           setLocation("Location unavailable");
//         }
//       },
//       () => {
//         setLocation("Location denied");
//       }
//     );
//   }, []);

//   // Fetch all data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const results = await Promise.allSettled([
//           getCars(),
//           getSales(),
//           getExpenses(),
//           getContacts(),
//         ]);

//         // Handle each result individually
//         if (results[0].status === "fulfilled") {
//           setCars(results[0].value.data || []);
//         } else {
//           console.error("Error fetching cars:", results[0].reason);
//           setCars([]);
//         }

//         if (results[1].status === "fulfilled") {
//           setSales(results[1].value.data || []);
//         } else {
//           console.error("Error fetching sales:", results[1].reason);
//           setSales([]);
//         }

//         if (results[2].status === "fulfilled") {
//           setExpenses(results[2].value.data || []);
//         } else {
//           console.warn("Expenses endpoint not available yet");
//           setExpenses([]);
//         }

//         if (results[3].status === "fulfilled") {
//           setContacts(results[3].value.data || []);
//         } else {
//           console.error("Error fetching contacts:", results[3].reason);
//           setContacts([]);
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Calculate KPIs
//   const totalCars = cars.length;
//   const totalRevenue = sales.reduce((sum, sale) => sum + (Number(sale.amount) || 0), 0);
//   const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
//   const netProfit = totalRevenue - totalExpenses;
//   const totalSales = sales.length;
//   const totalContacts = contacts.length;

//   // Car status distribution
//   const carStatusData = [
//     {
//       name: "Available",
//       value: cars.filter((c) => c.status === "available").length,
//       color: "#2fa88a",
//     },
//     {
//       name: "Reserved",
//       value: cars.filter((c) => c.status === "reserved").length,
//       color: "#fbbf24",
//     },
//     {
//       name: "Sold",
//       value: cars.filter((c) => c.status === "sold").length,
//       color: "#ef4444",
//     },
//   ].filter((item) => item.value > 0);

//   // Cars by brand
//   const carsByBrand = cars.reduce((acc, car) => {
//     const brand = car.model;
//     const existing = acc.find((b) => b.name === brand);
//     if (existing) {
//       existing.value += 1;
//     } else {
//       acc.push({ name: brand, value: 1 });
//     }
//     return acc;
//   }, []);

//   // Top 5 brands
//   const topBrands = carsByBrand
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 5);

//   // Sales trend (last 7 days - mock)
//   const salesTrendData = Array.from({ length: 7 }, (_, i) => {
//     const date = new Date();
//     date.setDate(date.getDate() - (6 - i));
//     const daySales = sales.filter(
//       (s) =>
//         new Date(s.created_at).toDateString() === date.toDateString()
//     );
//     return {
//       date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//       sales: daySales.length,
//       revenue: daySales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0),
//     };
//   });

//   // Price distribution
//   const priceRanges = [
//     { name: "0-2M", value: cars.filter((c) => Number(c.price) < 2000000).length },
//     {
//       name: "2-5M",
//       value: cars.filter(
//         (c) => Number(c.price) >= 2000000 && Number(c.price) < 5000000
//       ).length,
//     },
//     {
//       name: "5-10M",
//       value: cars.filter(
//         (c) => Number(c.price) >= 5000000 && Number(c.price) < 10000000
//       ).length,
//     },
//     {
//       name: "10M+",
//       value: cars.filter((c) => Number(c.price) >= 10000000).length,
//     },
//   ].filter((item) => item.value > 0);

//   const colors = ["#2fa88a", "#40916c", "#52b788", "#74c69d", "#95d5b2"];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-xl font-semibold text-gray-600">Loading dashboard...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-black">Dashboard</h1>
//         <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
//           <FaClock style={{ color: "#2fa88a" }} /> {now}
//           <span className="text-gray-300">|</span>
//           <FaMapMarkerAlt style={{ color: "#2fa88a" }} /> {location}
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//         <StatCard title="Total Cars" value={totalCars.toString()} icon={FaCar} />
//         <StatCard
//           title="Total Sales"
//           value={totalSales.toString()}
//           icon={FaShoppingCart}
//         />
//         <StatCard
//           title="Revenue"
//           value={`KSH ${(totalRevenue / 1000000).toFixed(1)}M`}
//           icon={FaDollarSign}
//         />
//         <StatCard
//           title="Expenses"
//           value={`KSH ${(totalExpenses / 1000000).toFixed(1)}M`}
//           icon={FaDollarSign}
//         />
//         <StatCard
//           title="Net Profit"
//           value={`KSH ${(netProfit / 1000000).toFixed(1)}M`}
//           icon={FaDollarSign}
//         />
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Car Status Distribution */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//           <h2 className="text-xl font-semibold mb-4 text-black">Car Status</h2>
//           {carStatusData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={carStatusData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {carStatusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <p className="text-gray-500 text-center py-12">No car data available</p>
//           )}
//         </div>

//         {/* Top Car Brands */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//           <h2 className="text-xl font-semibold mb-4 text-black">Top Brands in Stock</h2>
//           {topBrands.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={topBrands}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="name"
//                   angle={-15}
//                   textAnchor="end"
//                   height={80}
//                 />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#2fa88a" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <p className="text-gray-500 text-center py-12">No brand data available</p>
//           )}
//         </div>
//       </div>

//       {/* Second Row of Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Sales Trend */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//           <h2 className="text-xl font-semibold mb-4 text-black">Sales Trend (Last 7 Days)</h2>
//           {salesTrendData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={salesTrendData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis yAxisId="left" />
//                 <YAxis yAxisId="right" orientation="right" />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   yAxisId="left"
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#2fa88a"
//                   strokeWidth={2}
//                   dot={{ fill: "#2fa88a" }}
//                   name="Number of Sales"
//                 />
//                 <Line
//                   yAxisId="right"
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#fbbf24"
//                   strokeWidth={2}
//                   dot={{ fill: "#fbbf24" }}
//                   name="Revenue (KSH)"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <p className="text-gray-500 text-center py-12">No sales data available</p>
//           )}
//         </div>

//         {/* Price Distribution */}
//         <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//           <h2 className="text-xl font-semibold mb-4 text-black">Price Distribution</h2>
//           {priceRanges.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={priceRanges}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {priceRanges.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={colors[index]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <p className="text-gray-500 text-center py-12">No price data available</p>
//           )}
//         </div>
//       </div>

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
//         <div className="text-center">
//           <p className="text-sm text-gray-600 mb-2">Total Contacts</p>
//           <p className="text-3xl font-bold text-black">{totalContacts}</p>
//         </div>
//         <div className="text-center">
//           <p className="text-sm text-gray-600 mb-2">Average Car Price</p>
//           <p className="text-3xl font-bold text-black">
//             {cars.length > 0
//               ? `KSH ${(
//                   cars.reduce((sum, c) => sum + Number(c.price), 0) / cars.length / 1000000
//                 ).toFixed(1)}M`
//               : "N/A"}
//           </p>
//         </div>
//         <div className="text-center">
//           <p className="text-sm text-gray-600 mb-2">Profit Margin</p>
//           <p
//             className="text-3xl font-bold"
//             style={{
//               color: netProfit >= 0 ? "#2fa88a" : "#ef4444",
//             }}
//           >
//             {totalRevenue > 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}%` : "0%"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon: Icon }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-shadow border border-gray-200">
//       <div
//         className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
//         style={{ backgroundColor: "#e8f5e9", color: "#2fa88a" }}
//       >
//         <Icon />
//       </div>
//       <div>
//         <p className="text-sm text-gray-600">{title}</p>
//         <p className="text-2xl font-bold text-black">{value}</p>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import { FaCar, FaDollarSign, FaClock, FaMapMarkerAlt, FaShoppingCart, FaChartBar } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { getCars, getSales, getExpenses, getContacts } from "../../utils/api";

const Dashboard = () => {
  const now = new Date().toLocaleString();
  const [location, setLocation] = useState("Detecting location...");
  const [cars, setCars] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

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
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.state || "";
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

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          getCars(),
          getSales(),
          getExpenses(),
          getContacts(),
        ]);

        if (results[0].status === "fulfilled") {
          setCars(results[0].value.data || []);
        } else {
          console.error("Error fetching cars:", results[0].reason);
          setCars([]);
        }

        if (results[1].status === "fulfilled") {
          setSales(results[1].value.data || []);
        } else {
          console.error("Error fetching sales:", results[1].reason);
          setSales([]);
        }

        if (results[2].status === "fulfilled") {
          setExpenses(results[2].value.data || []);
        } else {
          console.warn("Expenses endpoint not available yet");
          setExpenses([]);
        }

        if (results[3].status === "fulfilled") {
          setContacts(results[3].value.data || []);
        } else {
          console.error("Error fetching contacts:", results[3].reason);
          setContacts([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate KPIs
  const totalCars = cars.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + (Number(sale.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalSales = sales.length;
  const totalContacts = contacts.length;

  // Format currency helper
  const formatCurrency = (num) => {
    if (num >= 1000000) {
      return `KSH ${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `KSH ${(num / 1000).toFixed(1)}K`;
    }
    return `KSH ${num.toFixed(0)}`;
  };

  // Car status distribution
  const carStatusData = [
    {
      name: "Available",
      value: cars.filter((c) => c.status === "available").length,
      color: "#2fa88a",
    },
    {
      name: "Reserved",
      value: cars.filter((c) => c.status === "reserved").length,
      color: "#fbbf24",
    },
    {
      name: "Sold",
      value: cars.filter((c) => c.status === "sold").length,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  // Cars by brand
  const carsByBrand = cars.reduce((acc, car) => {
    const brand = car.model;
    const existing = acc.find((b) => b.name === brand);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: brand, value: 1 });
    }
    return acc;
  }, []);

  const topBrands = carsByBrand
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Expenses by category
  const expensesByCategory = expenses.reduce((acc, exp) => {
    const category = exp.category || "Uncategorized";
    const existing = acc.find((e) => e.name === category);
    if (existing) {
      existing.value += Number(exp.amount) || 0;
    } else {
      acc.push({ name: category, value: Number(exp.amount) || 0 });
    }
    return acc;
  }, []);

  // Sales trend (last 7 days)
  const salesTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const daySales = sales.filter(
      (s) =>
        new Date(s.created_at).toDateString() === date.toDateString()
    );
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sales: daySales.length,
      revenue: daySales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0),
    };
  });

  // Price distribution
  const priceRanges = [
    { name: "0-2M", value: cars.filter((c) => Number(c.price) < 2000000).length },
    {
      name: "2-5M",
      value: cars.filter(
        (c) => Number(c.price) >= 2000000 && Number(c.price) < 5000000
      ).length,
    },
    {
      name: "5-10M",
      value: cars.filter(
        (c) => Number(c.price) >= 5000000 && Number(c.price) < 10000000
      ).length,
    },
    {
      name: "10M+",
      value: cars.filter((c) => Number(c.price) >= 10000000).length,
    },
  ].filter((item) => item.value > 0);

  const colors = ["#2fa88a", "#40916c", "#52b788", "#74c69d", "#95d5b2"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-700 bg-white px-4 py-3 rounded-lg shadow">
          <FaClock style={{ color: "#2fa88a" }} /> {now}
          <span className="text-gray-300">|</span>
          <FaMapMarkerAlt style={{ color: "#2fa88a" }} /> {location}
        </div>
      </div>

      {/* Main KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold opacity-90">Total Revenue</h3>
            <FaDollarSign className="text-2xl opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm opacity-75">From {totalSales} sales</p>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold opacity-90">Total Expenses</h3>
            <FaDollarSign className="text-2xl opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm opacity-75">{expenses.length} transactions</p>
        </div>

        {/* Net Profit Card */}
        <div
          className={`bg-gradient-to-br rounded-xl shadow-lg p-6 text-white ${
            netProfit >= 0
              ? "from-blue-400 to-blue-600"
              : "from-orange-400 to-orange-600"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold opacity-90">Net Profit</h3>
            <FaChartBar className="text-2xl opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(netProfit)}</p>
          <p className="text-sm opacity-75">
            {netProfit >= 0 ? "Profit" : "Loss"}
          </p>
        </div>

        {/* Total Cars Card */}
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold opacity-90">Total Inventory</h3>
            <FaCar className="text-2xl opacity-80" />
          </div>
          <p className="text-3xl font-bold mb-2">{totalCars}</p>
          <p className="text-sm opacity-75">Cars in stock</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Car Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Car Status</h2>
          {carStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={carStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {carStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No car data</p>
          )}
        </div>

        {/* Top Brands */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Brands in Stock</h2>
          {topBrands.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topBrands}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2fa88a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No brand data</p>
          )}
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h2>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No expense data</p>
          )}
        </div>

        {/* Sales Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Last 7 Days)</h2>
          {salesTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#2fa88a"
                  strokeWidth={2}
                  dot={{ fill: "#2fa88a" }}
                  name="Sales Count"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={{ fill: "#fbbf24" }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No sales data</p>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Total Contacts</p>
          <p className="text-3xl font-bold text-gray-900">{totalContacts}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Average Car Price</p>
          <p className="text-3xl font-bold text-gray-900">
            {cars.length > 0
              ? formatCurrency(
                  cars.reduce((sum, c) => sum + Number(c.price), 0) / cars.length
                )
              : "N/A"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Profit Margin</p>
          <p
            className="text-3xl font-bold"
            style={{
              color: netProfit >= 0 ? "#2fa88a" : "#ef4444",
            }}
          >
            {totalRevenue > 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}%` : "0%"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;