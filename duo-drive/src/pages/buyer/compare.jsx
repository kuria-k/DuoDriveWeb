import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFavourites, toggleFavourite } from "../../utils/api";
import { Heart, Trash2, Car, Fuel, Calendar, Gauge, Settings, MapPin } from "lucide-react";

const Compare = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const favs = await getFavourites();
        setCars(favs.map(f => f.car)); // only the car object
      } catch (err) {
        console.error("Failed to load favourites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const handleRemove = async (carId) => {
    try {
      await toggleFavourite(carId);
      setCars(prev => prev.filter(c => c.id !== carId));
    } catch (err) {
      console.error("Failed to remove car:", err);
    }
  };

  const formatPrice = (price) => `KES ${Number(price || 0).toLocaleString()}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-700"></div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-3xl font-bold mb-4">No cars selected for comparison</h2>
        <p className="text-gray-600 mb-6">
          Add cars to your favorites and select them to compare.
        </p>
        <button
          onClick={() => navigate("buyer/inventoryy")}
          className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Browse Cars
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Compare Cars</h1>

        {/* Desktop table-style comparison */}
        <div className="hidden lg:grid lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {car.images?.[0]?.url ? (
                  <img
                    src={car.images[0].url}
                    alt={car.name || car.model}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="text-gray-400" size={60} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900">
                    {car.model} {car.name} ({car.year})
                  </h2>
                  <button
                    onClick={() => handleRemove(car.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from comparison"
                  >
                    <Trash2 className="text-red-500 hover:text-red-700" size={20} />
                  </button>
                </div>

                <div className="text-teal-700 font-bold text-2xl">
                  {formatPrice(car.final_price || car.price)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{car.location || "N/A"}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Fuel size={16} className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Fuel</p>
                        <p className="text-sm font-semibold text-gray-800">{car.fuel_type || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Settings size={16} className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Transmission</p>
                        <p className="text-sm font-semibold text-gray-800">{car.transmission || "N/A"}</p>
                      </div>
                    </div>

                    {car.mileage && (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Gauge size={16} className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Mileage</p>
                          <p className="text-sm font-semibold text-gray-800">{car.mileage.toLocaleString()} km</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Calendar size={16} className="text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Year</p>
                        <p className="text-sm font-semibold text-gray-800">{car.year}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/buyer/details/${car.id}`)}
                    className="mt-4 w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile scrollable comparison */}
        <div className="lg:hidden flex gap-4 overflow-x-auto pb-4">
          {cars.map((car) => (
            <div key={car.id} className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {car.images?.[0]?.url ? (
                  <img
                    src={car.images[0].url}
                    alt={car.name || car.model}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="text-gray-400" size={60} />
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-gray-900">
                    {car.model} {car.name} ({car.year})
                  </h2>
                  <button
                    onClick={() => handleRemove(car.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="text-red-500 hover:text-red-700" size={20} />
                  </button>
                </div>
                <div className="text-teal-700 font-bold text-xl">
                  {formatPrice(car.final_price || car.price)}
                </div>
                <button
                  onClick={() => navigate(`/buyer/details/${car.id}`)}
                  className="mt-3 w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-xl font-semibold transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compare;
