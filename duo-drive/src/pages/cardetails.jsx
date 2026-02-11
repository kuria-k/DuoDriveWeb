// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Navbar from "../components/navbar";
// import Footer from "../components/footer";
// import { getCarById } from "../utils/api";
// import {
//   Heart,
//   Share2,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   Gauge,
//   Fuel,
//   Settings,
//   MapPin,
//   Check,
//   Phone,
//   Mail,
// } from "lucide-react";

// const CarDetail = () => {
//   const { id } = useParams();
//   const [car, setCar] = useState(null);
//   const [currentImage, setCurrentImage] = useState(0);
//   const [favorite, setFavorite] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCar = async () => {
//       try {
//         const res = await getCarById(id);
//         setCar(res.data);
//       } catch (err) {
//         console.error("Failed to load car", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCar();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div
//           className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
//           style={{ borderColor: "#2fa88a" }}
//         />
//       </div>
//     );
//   }

//   if (!car) {
//     return <div className="text-center py-20">Car not found</div>;
//   }

//   const images =
//     car.images?.length > 0
//       ? car.images.map((img) => img.url)
//       : ["/placeholder-car.jpg"];

//   const specs = [
//     { icon: Calendar, label: "Year", value: car.year },
//     { icon: Gauge, label: "Mileage", value: `${car.mileage} KM` },
//     { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
//     { icon: Settings, label: "Transmission", value: car.transmission },
//   ];

//   const nextImage = () =>
//     setCurrentImage((prev) => (prev + 1) % images.length);

//   const prevImage = () =>
//     setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

//   const formatKES = (value) =>
//     new Intl.NumberFormat("en-KE", {
//       style: "currency",
//       currency: "KES",
//       minimumFractionDigits: 0,
//     }).format(value);

//   return (
//     <>
//       <Navbar />

//       {/* IMAGE GALLERY */}
//       <section className="bg-black">
//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <div className="relative aspect-[16/9] rounded-3xl overflow-hidden group">
//             <img
//               src={images[currentImage]}
//               alt={car.name}
//               className="w-full h-full object-cover"
//             />

//             {/* Arrows */}
//             {images.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
//                 >
//                   <ChevronLeft />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
//                 >
//                   <ChevronRight />
//                 </button>
//               </>
//             )}

//             {/* Actions */}
//             <div className="absolute top-6 right-6 flex gap-3">
//               <button
//                 onClick={() => setFavorite(!favorite)}
//                 className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center"
//               >
//                 <Heart
//                   className={
//                     favorite
//                       ? "fill-red-500 text-red-500"
//                       : "text-gray-900"
//                   }
//                 />
//               </button>
//               <button className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center">
//                 <Share2 />
//               </button>
//             </div>
//           </div>

//           {/* Thumbnails */}
//           <div className="flex gap-4 mt-6">
//             {images.map((img, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setCurrentImage(idx)}
//                 className={`w-24 h-20 rounded-xl overflow-hidden border-2 ${
//                   idx === currentImage
//                     ? "border-[var(--jungle)]"
//                     : "border-transparent opacity-60"
//                 }`}
//               >
//                 <img src={img} className="w-full h-full object-cover" />
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* MAIN CONTENT */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <div className="grid lg:grid-cols-3 gap-10">
//           {/* LEFT */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* HEADER */}
//             <div className="bg-white rounded-2xl shadow p-8">
//               <span className="text-[var(--jungle)] font-semibold text-sm">
//                 {car.drive_type?.toUpperCase()} • {car.status}
//               </span>

//               <h1 className="text-4xl font-bold mt-2">
//                 {car.model} {car.name}
//               </h1>

//               <div className="flex items-center gap-2 text-gray-500 mt-3">
//                 <MapPin size={16} />
//                 {car.location}
//               </div>

//               <p className="text-4xl font-bold text-[var(--jungle)] mt-4">
//                 {car.final_price
//                   ? formatKES(car.final_price)
//                   : formatKES(car.price)}
//               </p>

//               {car.discount_percent > 0 && (
//                 <p className="text-gray-500 line-through mt-1">
//                   {formatKES(car.price)}
//                 </p>
//               )}
//             </div>

//             {/* SPECS */}
//             <div className="bg-white rounded-2xl shadow p-8">
//               <h2 className="text-2xl font-bold mb-6">Specifications</h2>
//               <div className="grid md:grid-cols-2 gap-6">
//                 {specs.map((spec, i) => (
//                   <div key={i} className="flex gap-4">
//                     <div className="w-12 h-12 bg-[var(--jungle)]/10 rounded-xl flex items-center justify-center">
//                       <spec.icon className="text-[var(--jungle)]" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">{spec.label}</p>
//                       <p className="font-semibold">{spec.value}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* DESCRIPTION */}
//             <div className="bg-white rounded-2xl shadow p-8">
//               <h2 className="text-2xl font-bold mb-4">Description</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 {car.description || "No description provided."}
//               </p>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-6 space-y-6">
//               <div className="bg-white rounded-2xl shadow p-8">
//                 <h3 className="text-2xl font-bold mb-6">Interested?</h3>

//                 <button className="w-full bg-[#2fa88a] text-white py-4 rounded-xl font-bold mb-4 transition transform hover:scale-105 hover:bg-[#238b6f] shadow-md hover:shadow-lg">
//                   Book Test Drive
//                 </button>

//                 <button className="w-full bg-black text-white py-4 rounded-xl font-bold transition transform hover:scale-105 hover:bg-gray-900">
//                   Request Financing
//                 </button>

//                 <div className="border-t mt-6 pt-6 space-y-4">
//                   <div className="flex items-center gap-4">
//                     <Phone className="text-[#2fa88a]" />
//                     <span className="font-semibold">+254 712 345 678</span>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <Mail className="text-[#2fa88a]" />
//                     <span className="font-semibold">
//                       sales@cardealer.co.ke
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </>
//   );
// };

// export default CarDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { getCarById } from "../utils/api";
import {
  Heart,
  Share2,
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
  Car,
} from "lucide-react";

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await getCarById(id);
        setCar(res.data);
      } catch (err) {
        console.error("Failed to load car", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

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
    { icon: Car, label: "Drive Type", value: car.drive_type },
    {
      icon: Car,
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
      <Navbar />

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
            {/* <div className="absolute top-6 right-6 flex gap-3">
              <button
                onClick={() => setFavorite(!favorite)}
                className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center"
              >
                <Heart
                  className={
                    favorite ? "fill-red-500 text-red-500" : "text-gray-900"
                  }
                />
              </button>
              <button className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center">
                <Share2 />
              </button>
            </div> */}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-6">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-24 h-20 rounded-xl overflow-hidden border-2 ${
                  idx === currentImage
                    ? "border-[#2fa88a]"
                    : "border-transparent opacity-60"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
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
                <button className="w-full bg-[#2fa88a] text-white py-4 rounded-xl font-bold mb-4 transition transform hover:scale-105 hover:bg-[#238b6f] shadow-md hover:shadow-lg">
                  Book Test Drive
                </button>

                {/* Request Financing */}
                <button className="w-full bg-black text-white py-4 rounded-xl font-bold transition transform hover:scale-105 hover:bg-gray-900 shadow-md hover:shadow-lg">
                  Request Financing
                </button>

                {/* Contact Info */}
                <div className="border-t mt-6 pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-[#2fa88a]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h2l3.6 7.59-1.35 2.44A1 1 0 008 17h10a1 1 0 001-1v-1H9.42l.93-1.67h7.65a1 1 0 00.9-.55l3.58-6.49A1 1 0 0021 5H5.21l-.94-2H1"
                      />
                    </svg>
                    <span className="font-semibold">+254 706 193 959</span>
                  </div>
                  {/* <div className="flex items-center gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-[#2fa88a]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12H8m0 0l-4-4m4 4l-4 4m12-4h4"
                      />
                    </svg>
                    <span className="font-semibold">sales@cardealer.co.ke</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default CarDetail;
