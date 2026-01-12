const Testimonial = () => {
  return (
    <div className="group bg-gradient-to-b from-white to-gray-50 text-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100">
      
      {/* QUOTE ICON */}
      <div className="text-5xl text-[#1f7a63]/20 font-serif leading-none mb-4">
        “
      </div>

      {/* TEXT */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        Duo Drive Kenya made my car import seamless. Transparent pricing and
        excellent customer service. I highly recommend them to anyone looking
        for a reliable dealership.
      </p>

      {/* FOOTER */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] text-white flex items-center justify-center font-bold text-lg shadow">
          J
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">
            James Mwangi
          </h4>
          <span className="text-sm text-gray-500">
            Nairobi, Kenya
          </span>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

