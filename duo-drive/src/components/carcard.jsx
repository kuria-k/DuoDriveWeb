import { Link } from "react-router-dom";

const CarCard = () => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
      
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/car-sample.jpg"
          alt="Car"
          className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badge */}
        <span className="absolute top-4 left-4 bg-[#1f7a63] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow">
          New Arrival
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h3 className="font-bold text-xl mb-1 text-gray-900">
          Toyota Harrier 2019
        </h3>

        <p className="text-[#1f7a63] font-extrabold text-2xl mb-3">
          KES 3,450,000
        </p>

        {/* Specs */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-6">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Petrol
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Automatic
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            45,000 KM
          </span>
        </div>

        {/* CTA */}
        <Link
          to="/car/1"
          className="block text-center w-full bg-black text-white py-3 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:bg-[#1f7a63] hover:shadow-lg"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CarCard;

