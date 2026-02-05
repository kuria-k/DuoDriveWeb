import React, { useEffect, useState } from "react";
import { getFavourites, toggleFavourite } from "../../utils/api";
import { AiFillHeart } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";

const BuyerFavourites = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const data = await getFavourites();
        setFavourites(data);
      } catch (err) {
        console.error("Error loading favourites:", err);
      }
    };
    fetchFavourites();
  }, []);

  const handleRemove = async (carId) => {
    try {
      await toggleFavourite(carId); // toggling again removes it
      setFavourites((prev) => prev.filter((fav) => fav.car.id !== carId));
    } catch (err) {
      console.error("Failed to remove favourite:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
        My Favourite Cars
      </h1>

      {favourites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Car image */}
              {fav.car.images?.length > 0 && (
                <img
                  src={fav.car.images[0].url}
                  alt={fav.car.name}
                  className="h-48 w-full object-cover"
                />
              )}

              {/* Car details */}
              <div className="p-4 flex flex-col justify-between h-44">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {fav.car.name} ({fav.car.year})
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {fav.car.model} • {fav.car.fuel_type} •{" "}
                    {fav.car.transmission}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-indigo-600">
                    ${Number(fav.car.final_price).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemove(fav.car.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <HiOutlineTrash className="text-xl" />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <AiFillHeart className="text-6xl text-gray-300 mb-4" />
          <p className="text-lg">You haven’t saved any cars yet.</p>
          <p className="text-sm mt-2">
            Browse cars and tap the heart icon to add them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuyerFavourites;
