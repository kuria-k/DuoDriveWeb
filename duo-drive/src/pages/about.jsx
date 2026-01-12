import Navbar from "../components/navbar";
import Footer from "../components/footer";

const About = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      {/* ABOUT HERO */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-6 text-black">
          About <span className="text-[#2fa88a]">Duo Drive Kenya</span>
        </h1>
        <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Duo Drive Kenya is a premium automotive dealership dedicated to
          providing Kenyans with high-quality vehicles sourced locally and
          internationally. Our commitment is transparency, reliability, and
          unmatched customer experience.
        </p>
      </section>

      {/* MISSION, VISION, GOALS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4 text-[#2fa88a]">Our Mission</h2>
            <p className="text-gray-700">
              To empower Kenyans with access to reliable, affordable, and
              high-quality vehicles while delivering exceptional customer
              service.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4 text-[#2fa88a]">Our Vision</h2>
            <p className="text-gray-700">
              To become Kenya’s most trusted automotive dealership, setting the
              standard for transparency and innovation in car sales.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-4 text-[#2fa88a]">Our Goals</h2>
            <p className="text-gray-700">
              Building long-term customer relationships, expanding our inventory
              with diverse options, and promoting sustainable automotive
              solutions.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Meet Our <span className="text-[#2fa88a]">Founders</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Kelvin */}
            <div className="bg-white text-black rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                {/* Replace with Kelvin's image */}
                <span className="text-gray-500">Kelvin's Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2fa88a]">
                  Kelvin Kuria Macharia
                </h3>
                <p className="text-gray-700 mt-2">
                  Co-Founder of Duo Drive Kenya. Passionate about delivering
                  reliable vehicles and building customer trust.
                </p>
              </div>
            </div>

            {/* Clarence */}
            <div className="bg-white text-black rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                {/* Replace with Clarence's image */}
                <span className="text-gray-500">Clarence's Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2fa88a]">
                  Clarence Sankaile Kasikua
                </h3>
                <p className="text-gray-700 mt-2">
                  Co-Founder of Duo Drive Kenya. Focused on innovation,
                  sustainability, and creating a premium automotive experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

