import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Gauge, Fuel, Zap, Settings, TrendingUp, Clock } from "lucide-react";

const Inventory = () => {
  const [cars, setCars] = useState([
    {
      id: 1,
      model: "Honda",
      name: "Odyssey",
      price: "35,000",
      status: "Available",
      images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80"],
      year: 2018,
      location: "Lagos, Nigeria",
      drive: "FWD",
      mileage: "45,000",
      engine: "2400",
      fuel: "Petrol",
      hp: "200",
      transmission: "Automatic",
      torque: "220",
      acceleration: "9.5",
      description: "Spacious and versatile family MPV engineered for comfort, featuring premium interior finishes and advanced safety features.",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [viewModalCar, setViewModalCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const emptyForm = {
    model: "",
    name: "",
    price: "",
    status: "Available",
    images: [],
    year: "",
    location: "",
    drive: "",
    mileage: "",
    engine: "",
    fuel: "",
    hp: "",
    transmission: "",
    torque: "",
    acceleration: "",
    description: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [imagePreview, setImagePreview] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...urls] });
    setImagePreview([...imagePreview, ...urls]);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreview(newPreviews);
  };

  const saveCar = () => {
    // Validation
    if (!formData.model || !formData.name || !formData.price) {
      alert("Please fill in Model, Name, and Price fields");
      return;
    }

    if (editingCarId) {
      setCars(
        cars.map((car) =>
          car.id === editingCarId ? { ...formData, id: editingCarId } : car
        )
      );
      setEditingCarId(null);
    } else {
      const newCar = { id: Date.now(), ...formData };
      setCars([...cars, newCar]);
    }
    setFormData({ ...emptyForm });
    setImagePreview([]);
    setShowModal(false);
  };

  const deleteCar = (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      setCars(cars.filter((car) => car.id !== id));
    }
  };

  const nextImage = () => {
    if (viewModalCar && viewModalCar.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === viewModalCar.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (viewModalCar && viewModalCar.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? viewModalCar.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600 mt-1">{cars.length} vehicle{cars.length !== 1 ? 's' : ''} in stock</p>
        </div>
        <button
          onClick={() => {
            setFormData({ ...emptyForm });
            setImagePreview([]);
            setEditingCarId(null);
            setShowModal(true);
          }}
          className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all text-white hover:shadow-xl hover:scale-105"
          style={{ backgroundColor: "#2fa88a" }}
        >
          + Add Stock
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-200 overflow-hidden">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md"
                   style={{ color: car.status === 'Available' ? '#2fa88a' : car.status === 'Sold' ? '#ef4444' : '#f59e0b' }}>
                {car.status}
              </div>
            </div>

            {/* Card content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{car.model} {car.name}</h2>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {car.year} • {car.transmission}
                </p>
                <p className="text-3xl font-bold mt-3" style={{ color: "#2fa88a" }}>
                  KSH{car.price}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setViewModalCar(car)}
                  className="w-full text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#2fa88a" }}
                >
                  View Details
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(car);
                      setImagePreview(car.images || []);
                      setEditingCarId(car.id);
                      setShowModal(true);
                    }}
                    className="flex-1 border-2 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    style={{ borderColor: "#2fa88a", color: "#2fa88a" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCar(car.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">{editingCarId ? "Edit Car" : "Add New Car"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black text-2xl">
                <X />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                />
                {imagePreview.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {imagePreview.map((img, idx) => (
                      <div key={idx} className="relative flex-shrink-0">
                        <img src={img} alt={`preview-${idx}`} className="w-24 h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Car Model *</label>
                  <input
                    type="text"
                    placeholder="e.g., Honda"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Car Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Odyssey"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (KSH) *</label>
                  <input
                    type="text"
                    placeholder="e.g., 35,000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    placeholder="2018"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Nairobi, Kenya"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Drive Type</label>
                  <input
                    type="text"
                    placeholder="FWD"
                    value={formData.drive}
                    onChange={(e) => setFormData({ ...formData, drive: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mileage</label>
                  <input
                    type="text"
                    placeholder="45,000 km"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Engine (CC)</label>
                  <input
                    type="text"
                    placeholder="2400cc"
                    value={formData.engine}
                    onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={formData.fuel}
                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Horsepower</label>
                  <input
                    type="text"
                    placeholder="200"
                    value={formData.hp}
                    onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="AMT">AMT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Torque (Nm)</label>
                  <input
                    type="text"
                    placeholder="220"
                    value={formData.torque}
                    onChange={(e) => setFormData({ ...formData, torque: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">0-100 km/h (s)</label>
                  <input
                    type="text"
                    placeholder="9.5"
                    value={formData.acceleration}
                    onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Enter detailed description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={saveCar}
                className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
                style={{ backgroundColor: "#2fa88a" }}
              >
                {editingCarId ? "Save Changes" : "Add Car"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium View More Modal */}
      {viewModalCar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b flex justify-between items-center rounded-t-3xl">
              <div>
                <h2 className="text-4xl font-bold text-gray-900">{viewModalCar.model} {viewModalCar.name}</h2>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {viewModalCar.location}
                </p>
              </div>
              <button onClick={() => { setViewModalCar(null); setCurrentImageIndex(0); }} className="text-gray-500 hover:text-black text-3xl">
                <X />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="relative bg-black">
              {viewModalCar.images && viewModalCar.images.length > 0 ? (
                <>
                  <img
                    src={viewModalCar.images[currentImageIndex]}
                    alt={`${viewModalCar.name}-${currentImageIndex}`}
                    className="w-full h-[500px] object-contain"
                  />
                  {viewModalCar.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                        {currentImageIndex + 1} / {viewModalCar.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-[500px] flex items-center justify-center bg-gray-200 text-gray-500">
                  No Images Available
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Price & Status */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Price</p>
                  <p className="text-5xl font-bold" style={{ color: "#2fa88a" }}>KSH{viewModalCar.price}</p>
                </div>
                <div className="px-6 py-3 rounded-full text-lg font-semibold"
                     style={{ 
                       backgroundColor: viewModalCar.status === 'Available' ? '#d1fae5' : viewModalCar.status === 'Sold' ? '#fee2e2' : '#fef3c7',
                       color: viewModalCar.status === 'Available' ? '#065f46' : viewModalCar.status === 'Sold' ? '#991b1b' : '#92400e'
                     }}>
                  {viewModalCar.status}
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <SpecCard icon={<Calendar />} label="Year" value={viewModalCar.year || "N/A"} />
                  <SpecCard icon={<Gauge />} label="Mileage" value={viewModalCar.mileage || "N/A"} />
                  <SpecCard icon={<Settings />} label="Transmission" value={viewModalCar.transmission || "N/A"} />
                  <SpecCard icon={<Fuel />} label="Fuel Type" value={viewModalCar.fuel || "N/A"} />
                  <SpecCard icon={<Zap />} label="Horsepower" value={viewModalCar.hp ? `${viewModalCar.hp} HP` : "N/A"} />
                  <SpecCard icon={<Settings />} label="Engine" value={viewModalCar.engine ? `${viewModalCar.engine} CC` : "N/A"} />
                  <SpecCard icon={<TrendingUp />} label="Torque" value={viewModalCar.torque ? `${viewModalCar.torque} Nm` : "N/A"} />
                  <SpecCard icon={<Clock />} label="0-100 km/h" value={viewModalCar.acceleration ? `${viewModalCar.acceleration}s` : "N/A"} />
                </div>
              </div>

              {/* Description */}
              {viewModalCar.description && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{viewModalCar.description}</p>
                </div>
              )}

              {/* Additional Details */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-semibold">Drive Type:</span>
                    <span>{viewModalCar.drive || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Location:</span>
                    <span>{viewModalCar.location || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              {/* <button
                className="w-full mt-8 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg"
                style={{ backgroundColor: "#2fa88a" }}
              >
                Contact Dealer
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Specification Card Component
const SpecCard = ({ icon, label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#2fa88a] transition-all">
    <div className="text-[#2fa88a] mb-2">{icon}</div>
    <p className="text-gray-600 text-sm mb-1">{label}</p>
    <p className="font-bold text-gray-900 text-lg">{value}</p>
  </div>
);

export default Inventory;



