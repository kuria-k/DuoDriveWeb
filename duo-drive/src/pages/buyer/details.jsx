import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getCars, getCarById, toggleFavourite, getFavourites } from "../../utils/api";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Zap,
  ArrowRight,
  TrendingUp,
  Car as CarIcon,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Music,
  Sparkles,
} from "lucide-react";
import { AiOutlineCar, AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const CarDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const userName = localStorage.getItem("userName") || "";
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await getCarById(id);
        setCar(res.data);
        
        // Fetch recommendations after getting the car
        await fetchRecommendations(res.data);
      } catch (err) {
        console.error("Failed to load car", err);
      } finally {
        setLoading(false);
      }
    };
    
    const loadFavourites = async () => {
      if (!userId) return;
      try {
        const favs = await getFavourites(userId);
        setFavourites(favs.map((f) => f.car.id));
      } catch (err) {
        console.error("Favourites load failed:", err);
        const saved = localStorage.getItem(`favourites_${userId}`);
        if (saved) {
          setFavourites(JSON.parse(saved));
        }
      }
    };

    fetchCar();
    loadFavourites();
  }, [id, userId]);

  const fetchRecommendations = async (currentCar) => {
    try {
      setLoadingRecommendations(true);
      const res = await getCars();
      const allCars = Array.isArray(res.data) ? res.data : res.data?.results || [];
      
      const currentPrice = currentCar.final_price || currentCar.price;
      const minPrice = currentPrice - 200000; // -200k
      const maxPrice = currentPrice + 300000; // +300k
      
      // Filter cars within the price range (between minPrice and maxPrice), excluding the current car
      const similar = allCars.filter(c => {
        if (c.id === currentCar.id) return false;
        const carPrice = c.final_price || c.price;
        return carPrice >= minPrice && carPrice <= maxPrice;
      });
      
      // Shuffle and take up to 4 cars
      const shuffled = similar.sort(() => 0.5 - Math.random()).slice(0, 4);
      setRecommendedCars(shuffled);
    } catch (err) {
      console.error("Failed to load recommendations", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleToggleFavourite = async (carId) => {
    setFavourites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );

    if (userId) {
      const updatedFavourites = favourites.includes(carId)
        ? favourites.filter((id) => id !== carId)
        : [...favourites, carId];
      localStorage.setItem(`favourites_${userId}`, JSON.stringify(updatedFavourites));
    }

    try {
      const result = await toggleFavourite(carId);
      console.log(result.message);
    } catch (err) {
      console.error("Toggle favourite failed:", err);
      setFavourites((prev) =>
        prev.includes(carId)
          ? prev.filter((id) => id !== carId)
          : [...prev, carId]
      );
    }
  };

  const isNewCar = (createdAt) => {
    if (!createdAt) return false;
    const created = new Date(createdAt);
    const now = new Date();
    return (now - created) / (1000 * 60 * 60 * 24) <= 3;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
          style={{ borderColor: "#2fa88a" }}
        />
      </div>
    );
  }

  if (!car) {
    return <div className="text-center py-20">Car not found</div>;
  }

  const images =
    car.images?.length > 0
      ? car.images.map((img) => img.url)
      : ["/placeholder-car.jpg"];

  const formatKES = (value) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(value);

  const specs = [
    { icon: Calendar, label: "Year", value: car.year },
    {
      icon: Gauge,
      label: "Mileage",
      value: car.mileage ? `${car.mileage} KM` : "N/A",
    },
    { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
    { icon: Settings, label: "Transmission", value: car.transmission },
    { icon: CarIcon, label: "Drive Type", value: car.drive_type },
    {
      icon: CarIcon,
      label: "Engine Capacity",
      value: car.engine_capacity_cc ? `${car.engine_capacity_cc} cc` : "N/A",
    },
    {
      icon: Zap,
      label: "Horsepower",
      value: car.horsepower ? `${car.horsepower} hp` : "N/A",
    },
    {
      icon: TrendingUp,
      label: "Torque",
      value: car.torque_nm ? `${car.torque_nm} Nm` : "N/A",
    },
    {
      icon: ArrowRight,
      label: "Top Speed",
      value: car.top_speed_kmh ? `${car.top_speed_kmh} km/h` : "N/A",
    },
  ];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* IMAGE GALLERY */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden group">
            <img
              src={images[currentImage]}
              alt={car.name}
              className="w-full h-full object-cover"
            />

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <ChevronRight />
                </button>
              </>
            )}

            {/* Actions */}
            <div className="absolute top-6 right-6 flex gap-3">
              <button
                onClick={() => setFavorite(!favorite)}
                className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition"
              >
                <Heart
                  className={
                    favorite ? "fill-red-500 text-red-500" : "text-gray-900"
                  }
                />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-24 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                  idx === currentImage
                    ? "border-[#2fa88a]"
                    : "border-transparent opacity-60 hover:opacity-100"
                } transition`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* HEADER */}
            <div className="bg-white rounded-2xl shadow p-8">
              <span className="text-[#2fa88a] font-semibold text-sm">
                Status: {car.status?.toUpperCase()} •{" "}
                {car.drive_type?.toUpperCase()}
              </span>

              <h1 className="text-4xl font-bold mt-2">
                {car.model} {car.name}
              </h1>

              <div className="flex items-center gap-2 text-gray-500 mt-3">
                <MapPin size={16} />
                {car.location}
              </div>

              <p className="text-4xl font-bold text-[#2fa88a] mt-4">
                {car.final_price
                  ? formatKES(car.final_price)
                  : formatKES(car.price)}
              </p>

              {car.discount_percent > 0 && (
                <p className="text-gray-500 line-through mt-1">
                  {formatKES(car.price)} ({car.discount_percent}% OFF)
                </p>
              )}
            </div>

            {/* SPECS */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Specifications</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#2fa88a]/10 rounded-xl flex items-center justify-center">
                      <spec.icon className="text-[#2fa88a]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{spec.label}</p>
                      <p className="font-semibold">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold mb-4">Vehicle Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                {car.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* RIGHT: CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-2xl shadow p-8">
                <h3 className="text-2xl font-bold mb-6">Interested?</h3>

                {/* Book Test Drive */}
                <button
                  onClick={() =>
                    navigate("/buyer/contact", {
                      state: { car },
                    })
                  }
                  className="w-full bg-[#2fa88a] text-white py-4 rounded-xl font-bold mb-4 transition transform hover:scale-105 hover:bg-[#238b6f] shadow-md hover:shadow-lg"
                >
                  Book Test Drive
                </button>

                {/* Request Financing */}
                <button
                  onClick={() =>
                    navigate("/buyer/contact", {
                      state: {
                        subject_type: "Financing",
                        message:
                          "I am interested in financing options. Please provide more details.",
                      },
                    })
                  }
                  className="w-full bg-black text-white py-4 rounded-xl font-bold transition transform hover:scale-105 hover:bg-gray-900 shadow-md hover:shadow-lg"
                >
                  Request Financing
                </button>

                {/* Contact Info */}
                <div className="border-t mt-6 pt-6 space-y-4">
                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-[#2fa88a]" />
                    <span className="font-semibold">+254 706 19 39 59</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-[#2fa88a]" />
                    <span className="font-semibold">
                      duodrivekenya@gmail.com
                    </span>
                  </div>

                  {/* Socials */}
                  <div className="flex items-center gap-4">
                    <Facebook className="w-5 h-5 text-[#2fa88a]" />
                    <Instagram className="w-5 h-5 text-[#2fa88a]" />
                    <Music className="w-5 h-5 text-[#2fa88a]" />
                    <span className="font-semibold">duo_drive.ke</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS SECTION */}
      {recommendedCars.length > 0 && (
        <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#2fa88a]/10 px-6 py-3 rounded-full mb-4">
                <Sparkles className="w-5 h-5 text-[#2fa88a]" />
                <span className="text-[#2fa88a] font-semibold text-sm">
                  Personalized For You
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                You Might Also Like
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Similar vehicles within your budget range — carefully selected just for you
              </p>
            </div>

            {/* Loading State */}
            {loadingRecommendations ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2fa88a]" />
              </div>
            ) : (
              /* Recommendations Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedCars.map((recCar) => (
                  <div
                    key={recCar.id}
                    className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl 
                    overflow-hidden border border-gray-100 hover:border-[#2fa88a]/30 
                    transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* NEW Badge */}
                    {isNewCar(recCar.created_at) && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white text-xs px-3 py-1.5 rounded-full font-bold z-10 shadow-lg">
                        NEW
                      </div>
                    )}

                    {/* Discount Badge */}
                    {recCar.discount_percent > 0 && (
                      <div className="absolute top-4 right-16 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 rounded-full font-bold z-10 shadow-lg">
                        {recCar.discount_percent}% OFF
                      </div>
                    )}

                    {/* Favourite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavourite(recCar.id);
                      }}
                      className="absolute top-4 right-4 z-20 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                    >
                      {favourites.includes(recCar.id) ? (
                        <AiFillHeart className="w-5 h-5 text-red-500" />
                      ) : (
                        <AiOutlineHeart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                      )}
                    </button>

                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
                      {recCar?.images?.[0]?.url ? (
                        <img
                          src={recCar.images[0].url}
                          alt={recCar.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <AiOutlineCar className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2fa88a] transition mb-2">
                          {recCar.model} {recCar.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {recCar.fuel_type} • {recCar.year || "2024"} • {recCar.transmission || "Automatic"}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mb-5 pb-5 border-b border-gray-100">
                        {recCar.discount_percent > 0 ? (
                          <div>
                            <p className="text-3xl font-bold text-[#2fa88a]">
                              KES {Number(recCar.final_price ?? recCar.price).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400 line-through mt-1">
                              KES {Number(recCar.price).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-3xl font-bold text-[#2fa88a]">
                            KES {Number(recCar.price ?? 0).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            navigate(`/buyer/details/${recCar.id}`);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                        >
                          View Details
                        </button>

                        {/* Book Test Drive */}
                        <button
                          onClick={() =>
                            navigate("/buyer/contact", {
                              state: {
                                car: recCar,
                              },
                            })
                          }
                          className="w-full border-2 border-[#2fa88a] text-[#2fa88a] py-3 rounded-xl font-semibold hover:bg-[#2fa88a] hover:text-white transition-all duration-200"
                        >
                          Book Test Drive
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View All Link */}
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/buyer/inventory")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
              >
                Browse All Vehicles
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CarDetail;