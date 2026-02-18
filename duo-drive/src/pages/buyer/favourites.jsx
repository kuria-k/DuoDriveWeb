import React, { useEffect, useState } from "react";
import { getFavourites, toggleFavourite } from "../../utils/api";
import { 
  Heart, 
  Trash2, 
  Car, 
  Fuel, 
  Calendar, 
  Gauge, 
  MapPin, 
  Settings,
  Sparkles,
  Filter,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BuyerFavourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent"); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const data = await getFavourites();
        setFavourites(data);
      } catch (err) {
        console.error("Error loading favourites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const handleRemove = async (carId, e) => {
    e.stopPropagation();
    try {
      await toggleFavourite(carId);
      setFavourites((prev) => prev.filter((fav) => fav.car.id !== carId));
    } catch (err) {
      console.error("Failed to remove favourite:", err);
    }
  };

  const handleCardClick = (carId) => {
    navigate(`/car/${carId}`);
  };

  const sortFavourites = (favouritesList) => {
    const sorted = [...favouritesList];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => (a.car.final_price || 0) - (b.car.final_price || 0));
      case "price-high":
        return sorted.sort((a, b) => (b.car.final_price || 0) - (a.car.final_price || 0));
      case "recent":
      default:
        return sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
  };

  const sortedFavourites = sortFavourites(favourites);

  const formatPrice = (price) => {
    return `KES ${Number(price || 0).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorite cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-700 p-3 rounded-xl">
              <Heart className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorite Cars</h1>
              <p className="text-gray-600">
                {favourites.length} {favourites.length === 1 ? 'car' : 'cars'} saved for later
              </p>
            </div>
          </div>

          {/* Stats and Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="ml-2 font-bold text-teal-700">{favourites.length}</span>
              </div>
              {/* {favourites.length > 0 && (
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm">
                  <span className="text-sm text-gray-600">Total Value:</span>
                  <span className="ml-2 font-bold text-teal-700">
                    {formatPrice(favourites.reduce((sum, fav) => sum + (fav.car.final_price || 0), 0))}
                  </span>
                </div>
              )} */}
            </div>

            {favourites.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <Filter size={18} className="text-gray-500" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm font-medium"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Favourites Grid */}
        {sortedFavourites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFavourites.map((fav) => {
              const car = fav.car;
              const mainImage = car.images?.[0]?.url || car.image || car.images?.[0];
              
              return (
                <div 
                  key={fav.id}
                  onClick={() => handleCardClick(car.id)}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={car.name || car.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="text-gray-400" size={60} />
                      </div>
                    )}
                    
                    {/* Favourite Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <Heart size={14} className="text-pink-500 fill-pink-500" />
                        <span className="text-xs font-semibold text-gray-700">Favourite</span>
                      </div>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-lg">
                      <span className="font-bold text-sm">{formatPrice(car.final_price)}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {car.name || car.model} ({car.year})
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          {car.location && (
                            <>
                              <MapPin size={14} />
                              <span className="text-sm">{car.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => handleRemove(car.id, e)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        title="Remove from favorites"
                      >
                        <Trash2 size={20} className="text-red-500 hover:text-red-700" />
                      </button>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Fuel size={16} className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Fuel</p>
                          <p className="text-sm font-semibold text-gray-800">{car.fuel_type || "N/A"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Settings size={16} className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Transmission</p>
                          <p className="text-sm font-semibold text-gray-800">{car.transmission || "N/A"}</p>
                        </div>
                      </div>
                      
                      {car.mileage && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Gauge size={16} className="text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500">Mileage</p>
                            <p className="text-sm font-semibold text-gray-800">{car.mileage.toLocaleString()} km</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Calendar size={16} className="text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Year</p>
                          <p className="text-sm font-semibold text-gray-800">{car.year || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer with CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-600">
                        Added {fav.created_at ? new Date(fav.created_at).toLocaleDateString() : "recently"}
                      </span>
                      <div className="flex items-center gap-1 text-teal-700 font-semibold group-hover:gap-2 transition-all">
                        <span>View Details</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-50 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-pink-500" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Favorites Yet</h3>
              <p className="text-gray-600 mb-6">
                Start exploring cars and save your favorites to compare and revisit later.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
  onClick={() => navigate("/buyer/inventory")}
  className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
>
  Browse Cars
</button>
<button
  onClick={() => navigate("/buyer/dashboard")}
  className="bg-white border-2 border-gray-300 hover:border-teal-700 text-gray-800 hover:text-teal-700 px-8 py-3 rounded-xl font-semibold transition-colors"
>
  Go to Dashboard
</button>

              </div>
              
              {/* Tips */}
              <div className="mt-8 p-4 bg-teal-50 rounded-xl border border-teal-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-teal-600" size={18} />
                  <p className="text-sm font-medium text-teal-800">Tip</p>
                </div>
                <p className="text-sm text-teal-700">
                  Click the heart icon ❤️ on any car listing to add it to your favorites.
                  This helps you keep track of cars you're interested in.
                </p>
              </div>
            </div>
          </div>
        )}

        {sortedFavourites.length > 0 && (
  <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Your Dream Garage</h3>
        <p className="text-gray-600 text-sm">
          Don’t just save them — make them yours
        </p>
      </div>
      <button
        onClick={() => navigate("/buyer/contact")}
        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold 
                   transition-colors animate-bounce"
      >
        Make It Yours 🚗
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default BuyerFavourites;
