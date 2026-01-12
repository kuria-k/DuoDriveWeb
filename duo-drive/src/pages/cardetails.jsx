import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
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
  Check,
  Phone,
  Mail,
} from "lucide-react";

const CarDetail = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [favorite, setFavorite] = useState(false);

  const car = {
    name: "Toyota Land Cruiser Prado",
    price: "KES 7,800,000",
    year: "2019",
    mileage: "45,000 KM",
    fuel: "Petrol",
    transmission: "Automatic",
    location: "Nairobi, Kenya",
    images: [
      "/assets/car-detail.jpg",
      "/assets/car-detail-2.jpg",
      "/assets/car-detail-3.jpg",
      "/assets/car-detail-4.jpg",
    ],
  };

  const specs = [
    { icon: Calendar, label: "Year", value: car.year },
    { icon: Gauge, label: "Mileage", value: car.mileage },
    { icon: Fuel, label: "Fuel Type", value: car.fuel },
    { icon: Settings, label: "Transmission", value: car.transmission },
  ];

  const features = [
    "Leather Interior",
    "Sunroof",
    "4WD Capability",
    "Reverse Camera",
    "Cruise Control",
    "Push Start",
    "Dual Zone Climate Control",
    "Alloy Wheels",
  ];

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % car.images.length);

  const prevImage = () =>
    setCurrentImage(
      (prev) => (prev - 1 + car.images.length) % car.images.length
    );

  return (
    <>
      <Navbar />

      {/* IMAGE GALLERY */}
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden group">
            <img
              src={car.images[currentImage]}
              alt={car.name}
              className="w-full h-full object-cover"
            />

            {/* Arrows */}
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

            {/* Actions */}
            <div className="absolute top-6 right-6 flex gap-3">
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
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-6">
            {car.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-24 h-20 rounded-xl overflow-hidden border-2 ${
                  idx === currentImage
                    ? "border-[var(--jungle)]"
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
              <span className="text-[var(--jungle)] font-semibold text-sm">
                SUV • 4WD
              </span>
              <h1 className="text-4xl font-bold mt-2">{car.name}</h1>

              <div className="flex items-center gap-2 text-gray-500 mt-3">
                <MapPin size={16} />
                {car.location}
              </div>

              <p className="text-4xl font-bold text-[var(--jungle)] mt-4">
                {car.price}
              </p>
            </div>

            {/* SPECS */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Specifications</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {specs.map((spec, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-[var(--jungle)]/10 rounded-xl flex items-center justify-center">
                      <spec.icon className="text-[var(--jungle)]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{spec.label}</p>
                      <p className="font-semibold">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FEATURES */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[var(--jungle)]/10 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-[var(--jungle)]" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl shadow p-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                This 2019 Toyota Land Cruiser Prado is a perfect blend of luxury,
                reliability, and off-road capability. Well maintained with low
                mileage, it offers exceptional comfort, powerful performance,
                and legendary Toyota durability — ideal for both city driving
                and rugged terrain.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-2xl shadow p-8">
                <h3 className="text-2xl font-bold mb-6">Interested?</h3>

               <button className="w-full bg-[#2fa88a] text-white py-4 rounded-xl font-bold mb-4 transition transform hover:scale-105 hover:bg-[#238b6f] shadow-md hover:shadow-lg" >
                  Book Test Drive
                </button>

                <button className="w-full bg-black text-white py-4 rounded-xl font-bold transition transform hover:scale-105 hover:bg-gray-900">
                  Request Financing
                </button>

                <div className="border-t mt-6 pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Phone className="text-[#2fa88a]" />
                    <span className="font-semibold">+254 712 345 678</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="text-[#2fa88a]" />
                    <span className="font-semibold">sales@cardealer.co.ke</span>
                  </div>
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

