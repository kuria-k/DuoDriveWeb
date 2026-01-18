import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import SearchBar from "../components/searchbar";
import CarCard from "../components/carcard";
import Testimonial from "../components/testimonials";
import wagon from "../assets/Gwagon.jpg"

const Home = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
     <section className="relative h-screen overflow-hidden bg-black text-white">
  {/* Background Image */}
  <div
    className="absolute inset-0 transition-transform duration-700 ease-out"
    style={{
      backgroundImage: `url(${wagon})`, // G-Wagon background
      backgroundSize: "cover",
      backgroundPosition: "center",
      transform: `scale(${1 + scrollY * 0.0005})`,
      filter: "brightness(0.5) contrast(1.2)"
    }}
  />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-[#2fa88a]/50 mix-blend-multiply" />

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center px-6">
    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fadeIn">
      Drive Your Dream
      <br />
      <span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent animate-gradient">
        With Duo Drive Kenya
      </span>
    </h1>

    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 animate-slideUp">
      Premium new & used vehicles. Trusted imports. Flexible financing across Kenya.
    </p>

    <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl p-4 max-w-4xl animate-pop">
      <SearchBar />
    </div>
  </div>
</section>


      {/* ================= TRUST ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            "Verified Imports",
            "Flexible Financing",
            "Nationwide Delivery",
            "Trusted Since 2018"
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

          <div className="grid md:grid-cols-3 gap-10">
            <CarCard />
            <CarCard />
            <CarCard />
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

