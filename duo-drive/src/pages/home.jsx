import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
// import SearchBar from "../components/searchbar";
import CarCard from "../components/carcard";
import Testimonial from "../components/testimonials";
import wagon from "../assets/Gwagon.jpg";
import { getCars } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await getCars();

        // Ensure we have an array
        const carsArray = Array.isArray(response.data) ? response.data : [];

        // Sort by created_at (newest first) and take top 3
        const sorted = carsArray
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);

        setCars(sorted);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  const isNewCar = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 30; // mark as NEW if added within 30 days
  };

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative h-screen overflow-hidden bg-black text-white">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 will-change-transform transition-transform duration-700 ease-out"
          style={{
            backgroundImage: `url(${wagon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `scale(${1 + Math.min(scrollY, 300) * 0.0004})`,
            filter: "brightness(0.59) contrast(1.15) saturate(1.05)",
          }}
        />

        {/* Dark + Brand Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1f7a63]/20 to-black/40 mix-blend-screen" />

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#2fa88a]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-[#1f7a63]/20 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl animate-fadeIn">
            Drive Your Dream
            <br />
            <span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent">
              With Duo Drive Kenya
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-300 md:text-xl animate-slideUp">
            Premium new & used vehicles. Trusted imports.
            <br className="hidden md:block" />
            Flexible financing, delivered anywhere in Kenya.
          </p>

          {/* CTA Row */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-pop">
            <a
              href="/inventory"
              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] px-8 py-4 text-base font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              Browse Inventory
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Contact Us Now
            </a>
          </div>

          {/* Optional Search Glass Card */}
          {/*
    <div className="mt-12 max-w-4xl rounded-2xl bg-white/10 p-4 shadow-2xl backdrop-blur-xl animate-pop">
      <SearchBar />
    </div>
    */}
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            "Verified Imports",
            "Flexible Financing",
            "Nationwide Delivery",
            "Trusted Since 2018",
          ].map((item, index) => (
            <div
              key={item}
              className="group p-6 rounded-2xl transition hover:-translate-y-3 hover:shadow-xl"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#1f7a63]/10 flex items-center justify-center text-[#1f7a63] text-2xl font-bold group-hover:bg-[#1f7a63] group-hover:text-white transition">
                ✓
              </div>
              <p className="font-semibold text-gray-800">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED CARS ================= */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="uppercase text-sm tracking-wider text-[#1f7a63] font-semibold">
              Premium Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Featured Inventory
            </h2>
            <div className="w-24 h-1 bg-[#1f7a63] mx-auto mt-6 rounded-full" />
          </div>

          <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.length === 0 ? (
              <p className="text-center text-gray-500 col-span-3">
                No cars available at the moment.
              </p>
            ) : (
              cars.map((car) => (
                <div
                  key={car.id}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden border hover:scale-105 transition"
                >
                  {/* NEW badge */}
                  {isNewCar(car.created_at) && (
                    <div className="absolute top-3 left-3 bg-[#2fa88a] text-white text-xs px-3 py-1 rounded-full font-bold z-10">
                      NEW
                    </div>
                  )}

                  {/* Discount badge */}
                  {Number(car.discount_percent) > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold z-10">
                      {car.discount_percent}% OFF
                    </div>
                  )}

                  {/* Image */}
                  {car.images?.length > 0 ? (
                    <img
                      src={car.images[0].url}
                      alt={car.name}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                      No Image
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900">
                      {car.model} {car.name}
                    </h3>

                    <p className="text-2xl font-bold mt-3 text-[#2fa88a]">
                      {Number(car.discount_percent) > 0 ? (
                        <>
                          KES {Number(car.final_price).toLocaleString()}
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            KES {Number(car.price).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        `KES ${Number(car.price).toLocaleString()}`
                      )}
                    </p>

                    {/* Action buttons */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/cardetails/${car.id}`)}
                        className="flex-1 bg-[#2fa88a] text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate("/contact", { state: { car } })}
                        className="flex-1 border-2 border-[#2fa88a] text-[#2fa88a] py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="uppercase text-sm tracking-wider text-[#2fa88a] font-semibold">
              Client Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Testimonial />
            <Testimonial />
            <Testimonial />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] text-white text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Own Your Next Car?
        </h2>

        <p className="text-lg mb-10 text-white/90">
          Talk to Duo Drive Kenya today and drive away with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-black px-10 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#1f7a63] transition">
            Browse Inventory
          </button>
          <button className="bg-white text-[#1f7a63] px-10 py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition">
            Book Test Drive
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
