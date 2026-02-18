import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars, getFavourites } from "../../utils/api";
import { Car, Heart, Sparkles, Filter, Sun, Moon, Sunrise } from "lucide-react";
import { motion } from "framer-motion";

const BuyerDashboard = () => {
  const navigate = useNavigate();

  const [favourites, setFavourites] = useState([]);
  const [recentCars, setRecentCars] = useState([]);
  const [popularCars, setPopularCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState({ text: "", icon: null });
  const [userName, setUserName] = useState("");
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get username from sessionstorage
        const storedName = sessionStorage.getItem("userName") || "Buyer";
        setUserName(storedName);

        // Fetch favourites
        const favs = await getFavourites();
        setFavourites(favs);

        // Fetch cars
        const allCarsResponse = await getCars();
        const allCars = allCarsResponse.data;
        setCars(allCars);

        // Recent cars
        const recent = allCars
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecentCars(recent);

        // Popular cars
        const popular = allCars
          .sort((a, b) => (b.favourites_count || 0) - (a.favourites_count || 0))
          .slice(0, 5);
        setPopularCars(popular);

        // Set greeting based on time
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 5 && hour < 12) {
          setGreeting({ text: "Good Morning", icon: <Sunrise className="text-yellow-400" size={36} /> });
        } else if (hour >= 12 && hour < 18) {
          setGreeting({ text: "Good Afternoon", icon: <Sun className="text-yellow-500" size={36} /> });
        } else {
          setGreeting({ text: "Good Evening", icon: <Moon className="text-purple-700" size={36} /> });
        }

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-teal-700 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Animated Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-4 mb-10"
        >
          {greeting.icon}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{greeting.text}, {userName}</h1>
            <p className="text-gray-600 mt-1">Explore new cars, track your favorites, and find your next ride.</p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <Sparkles size={28} className="text-teal-700 mb-2" />
            <p className="text-gray-500">Total Favorites</p>
            <h2 className="text-2xl font-bold text-gray-900">{favourites.length}</h2>
          </div>
          {/* <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <Filter size={28} className="text-teal-700 mb-2" />
            <p className="text-gray-500">Recently Applied Filters</p>
            <h2 className="text-2xl font-bold text-gray-900">N/A</h2>
          </div> */}
         <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
  <Car size={28} className="text-teal-700 mb-2" />
  <p className="text-gray-500">Cars Available</p>
  <h2 className="text-2xl font-bold text-gray-900">
    {cars.filter((car) => car.status !== "sold" && car.status !== "reserved"
).length}
  </h2>
</div>

        </div>

        {/* Recent Cars */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recently Added Cars</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentCars.map(car => (
              <div
                key={car.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                onClick={() => navigate(`/buyer/details/${car.id}`)}
              >
                <div className="relative h-48 bg-gray-100">
                  {car.images?.[0]?.url ? (
                    <img src={car.images[0].url} alt={car.name || car.model} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="text-gray-400" size={60} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900">{car.model} {car.name}</h3>
                  <p className="text-gray-500">{car.fuel_type} • {car.transmission} • {car.year}</p>
                  <p className="text-teal-700 font-bold mt-2">
                    KES {Number(car.final_price || car.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Cars */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Cars</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularCars.map(car => (
              <div
                key={car.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                onClick={() => navigate(`/buyer/details/${car.id}`)}
              >
                <div className="relative h-48 bg-gray-100">
                  {car.images?.[0]?.url ? (
                    <img src={car.images[0].url} alt={car.name || car.model} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="text-gray-400" size={60} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900">{car.model} {car.name}</h3>
                  <p className="text-gray-500">{car.fuel_type} • {car.transmission} • {car.year}</p>
                  <p className="text-teal-700 font-bold mt-2">
                    KES {Number(car.final_price || car.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default BuyerDashboard;
