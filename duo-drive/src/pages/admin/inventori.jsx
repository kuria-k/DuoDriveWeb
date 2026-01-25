// import React, { useState, useEffect } from "react";
// import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Gauge, Fuel, Zap, Settings, TrendingUp, Clock } from "lucide-react";
// import { getCars, createCar, updateCarWithImages, deleteCar } from "../../utils/api";

// const Inventory = () => {
//   const [cars, setCars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCarId, setEditingCarId] = useState(null);
//   const [viewModalCar, setViewModalCar] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [carToDelete, setCarToDelete] = useState(null);
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });

//   const normalizeCar = (car) => ({
//   id: car.id,

//   // core
//   model: car.model,
//   name: car.name,
//   price: car.price,
//   status: car.status,
//   year: car.year,
//   location: car.location,

//   // specs (DB → frontend)
//   drive: car.drive_type,
//   mileage: car.mileage,
//   engine: car.engine_capacity_cc,
//   fuel: car.fuel_type,
//   hp: car.horsepower,
//   transmission: car.transmission,
//   torque: car.torque_nm,
//   top_speed: car.top_speed_kmh,
//   description: car.description,

//   // images
//   images: car.images || [],
// });

//   const emptyForm = {
//     model: "",
//     name: "",
//     price: "",
//     status: "available",
//     year: "",
//     location: "",
//     drive: "",
//     mileage: "",
//     engine: "",
//     fuel: "",
//     hp: "",
//     transmission: "",
//     torque: "",
//     top_speed: "",
//     description: "",
//   };

//   const [formData, setFormData] = useState({ ...emptyForm });
//   const [imageFiles, setImageFiles] = useState([]);
//   const [imagePreview, setImagePreview] = useState([]);

//   useEffect(() => {
//     fetchCars();
//   }, []);

//   const fetchCars = async () => {
//     try {
//       setLoading(true);
//       const response = await getCars();
//       setCars(response.data.map(normalizeCar));
//     } catch (error) {
//       console.error("Error fetching cars:", error);
//       showToast("Failed to fetch cars", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showToast = (message, type) => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setImageFiles([...imageFiles, ...files]);
//     const urls = files.map((file) => URL.createObjectURL(file));
//     setImagePreview([...imagePreview, ...urls]);
//   };

//   const removeImage = (index) => {
//     setImageFiles(imageFiles.filter((_, i) => i !== index));
//     setImagePreview(imagePreview.filter((_, i) => i !== index));
//   };

//   const saveCar = async () => {
//     if (!formData.model || !formData.name || !formData.price) {
//       showToast("Please fill in Model, Name, and Price fields", "error");
//       return;
//     }

//     try {
//       // Map frontend field names to backend field names
//      const backendData = {
//   model: formData.model,
//   name: formData.name,
//   price: formData.price,
//   status: formData.status,

//   year: Number(formData.year),
//   location: formData.location,

//   drive_type: formData.drive,
//   mileage: Number(formData.mileage),
//   engine_capacity_cc: Number(formData.engine),
//   fuel_type: formData.fuel,
//   horsepower: Number(formData.hp),
//   transmission: formData.transmission,
//   torque_nm: Number(formData.torque),
//   top_speed_kmh: Number(formData.top_speed),

//   description: formData.description,
// };

//       console.log("Mapped backend data:", backendData);
//       console.log("Image files:", imageFiles);

//       if (editingCarId) {
//         await updateCarWithImages(editingCarId, backendData, imageFiles);
//         showToast("Car updated successfully!", "success");
//       } else {
//         const response = await createCar(backendData, imageFiles);
//         console.log("Create response:", response.data);
//         showToast("Car added successfully!", "success");
//       }

//       fetchCars();
//       setFormData({ ...emptyForm });
//       setImageFiles([]);
//       setImagePreview([]);
//       setShowModal(false);
//       setEditingCarId(null);
//     } catch (error) {
//       console.error("Error saving car:", error);
//       console.error("Error response data:", error.response?.data);

//       const errorMessage = error.response?.data?.message ||
//                           error.response?.data?.detail ||
//                           JSON.stringify(error.response?.data) ||
//                           "Failed to save car";
//       showToast(errorMessage, "error");
//     }
//   };

//   const handleDeleteClick = (car) => {
//     setCarToDelete(car);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await deleteCar(carToDelete.id);
//       setCars(cars.filter((car) => car.id !== carToDelete.id));
//       setShowDeleteModal(false);
//       setCarToDelete(null);
//       showToast("Car deleted successfully!", "success");
//     } catch (error) {
//       console.error("Error deleting car:", error);
//       showToast("Failed to delete car", "error");
//     }
//   };

//   const nextImage = () => {
//     if (viewModalCar?.images?.length > 0) {
//       setCurrentImageIndex((prev) => (prev === viewModalCar.images.length - 1 ? 0 : prev + 1));
//     }
//   };

//   const prevImage = () => {
//     if (viewModalCar?.images?.length > 0) {
//       setCurrentImageIndex((prev) => (prev === 0 ? viewModalCar.images.length - 1 : prev - 1));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       {toast.show && (
//         <div className="fixed top-6 right-6 z-50">
//           <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${toast.type === "success" ? "bg-white/90 border-l-4" : "bg-red-50/90 border-l-4 border-red-500"}`} style={toast.type === "success" ? { borderColor: "#2fa88a" } : {}}>
//             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white`} style={toast.type === "success" ? { backgroundColor: "#2fa88a" } : { backgroundColor: "#ef4444" }}>
//               {toast.type === "success" ? "✓" : "✕"}
//             </div>
//             <span className="font-medium text-gray-800">{toast.message}</span>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-4xl font-bold text-gray-900">Inventory</h1>
//           <p className="text-gray-600 mt-1">{cars.length} vehicle{cars.length !== 1 ? 's' : ''} in stock</p>
//         </div>
//         <button onClick={() => { setFormData({ ...emptyForm }); setImageFiles([]); setImagePreview([]); setEditingCarId(null); setShowModal(true); }} className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all text-white hover:shadow-xl hover:scale-105" style={{ backgroundColor: "#2fa88a" }}>+ Add Stock</button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#2fa88a" }}></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {cars.map((car) => (
//             <div key={car.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col transform hover:-translate-y-1">
//               <div className="relative h-48 bg-gray-200 overflow-hidden">
//                 {car.images?.length > 0 ? <img src={car.images[0].url} alt={car.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
//                 <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md" style={{ color: car.status === 'available' ? '#2fa88a' : car.status === 'sold' ? '#ef4444' : '#f59e0b' }}>{car.status === 'available' ? 'Available' : car.status === 'reserved' ? 'Reserved' : 'Sold'}</div>
//               </div>
//               <div className="p-5 flex-1 flex flex-col justify-between">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900">{car.model} {car.name}</h2>
//                   <p className="text-gray-600 mt-1 flex items-center gap-2"><Calendar className="w-4 h-4" />{car.year} • {car.transmission}</p>
//                   <p className="text-3xl font-bold mt-3" style={{ color: "#2fa88a" }}>KSH{car.price}</p>
//                 </div>
//                 <div className="mt-4 space-y-2">
//                   <button onClick={() => setViewModalCar(car)} className="w-full text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-all" style={{ backgroundColor: "#2fa88a" }}>View Details</button>
//                   <div className="flex gap-2">
//                     <button onClick={() => { setFormData(car); setImageFiles([]); setImagePreview([]); setEditingCarId(car.id); setShowModal(true); }} className="flex-1 border-2 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all" style={{ borderColor: "#2fa88a", color: "#2fa88a" }}>Edit</button>
//                     <button onClick={() => handleDeleteClick(car)} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-all">Delete</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {showDeleteModal && carToDelete && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
//           <div className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 border border-white/20" style={{ background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(20px)" }}>
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Vehicle</h2>
//               <p className="text-gray-700 mb-2">Are you sure you want to delete this vehicle?</p>
//               <p className="text-gray-500 text-sm"><span className="font-semibold">{carToDelete.model} {carToDelete.name}</span></p>
//               <p className="text-gray-400 text-xs mt-1">This action cannot be undone.</p>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all">Delete</button>
//               <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-medium hover:bg-gray-300">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
//           <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-3xl font-bold text-gray-900">{editingCarId ? "Edit Car" : "Add New Car"}</h2>
//               <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black text-2xl"><X /></button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
//                 <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" />
//                 {imagePreview.length > 0 && (
//                   <div className="flex gap-2 mt-3 overflow-x-auto">
//                     {imagePreview.map((img, idx) => (
//                       <div key={idx} className="relative flex-shrink-0">
//                         <img src={img} alt={`preview-${idx}`} className="w-24 h-24 object-cover rounded-lg" />
//                         <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><X className="w-3 h-3" /></button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Car Model *</label><input type="text" placeholder="e.g., Honda" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Car Name *</label><input type="text" placeholder="e.g., Odyssey" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Price (KSH) *</label><input type="text" placeholder="e.g., 35,000" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select></div>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Year</label><input type="number" placeholder="2018" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Location</label><input type="text" placeholder="Nairobi" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Drive</label>
//                   <select
//                     value={formData.drive}
//                     onChange={(e) => setFormData({ ...formData, drive: e.target.value })}
//                     className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
//                   >
//                     <option value="">Select</option>
//                     <option value="fwd">Front-wheel drive</option>
//                     <option value="rwd">Rear-wheel drive</option>
//                     <option value="awd">All-wheel drive</option>
//                     <option value="4wd">4-wheel drive</option>
//                   </select>
//                 </div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Mileage</label><input type="text" placeholder="45,000" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Engine</label><input type="text" placeholder="2400" value={formData.engine} onChange={(e) => setFormData({ ...formData, engine: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Fuel</label><select value={formData.fuel} onChange={(e) => setFormData({ ...formData, fuel: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"><option value="">Select</option><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="hybrid">Hybrid</option><option value="electric">Electric</option></select></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">HP</label><input type="text" placeholder="200" value={formData.hp} onChange={(e) => setFormData({ ...formData, hp: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Trans</label><select value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"><option value="">Select</option><option value="manual">Manual</option><option value="automatic">Automatic</option></select></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Torque</label><input type="text" placeholder="220" value={formData.torque} onChange={(e) => setFormData({ ...formData, torque: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//                 <div><label className="block text-sm font-semibold text-gray-700 mb-2">Top Speed (km/h)</label><input type="text" placeholder="220" value={formData.top_speed} onChange={(e) => setFormData({ ...formData, top_speed: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//               </div>
//               <div><label className="block text-sm font-semibold text-gray-700 mb-2">Description</label><textarea placeholder="Description..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none" /></div>
//             </div>
//             <div className="mt-6 flex gap-3">
//               <button onClick={saveCar} className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all" style={{ backgroundColor: "#2fa88a" }}>{editingCarId ? "Save Changes" : "Add Car"}</button>
//               <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {viewModalCar && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
//           <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
//             <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b flex justify-between items-center rounded-t-3xl">
//               <div>
//                 <h2 className="text-4xl font-bold text-gray-900">{viewModalCar.model} {viewModalCar.name}</h2>
//                 <p className="text-gray-600 mt-1 flex items-center gap-2"><MapPin className="w-4 h-4" />{viewModalCar.location}</p>
//               </div>
//               <button onClick={() => { setViewModalCar(null); setCurrentImageIndex(0); }} className="text-gray-500 hover:text-black text-3xl"><X /></button>
//             </div>
//             <div className="relative bg-black">
//               {viewModalCar.images?.length > 0 ? (
//                 <>
//                  <img
//   src={viewModalCar.images[currentImageIndex].url}
//   alt={viewModalCar.name}
//   className="w-full h-[500px] object-contain"
// />

//                   {viewModalCar.images.length > 1 && (
//                     <>
//                       <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"><ChevronLeft className="w-6 h-6" /></button>
//                       <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"><ChevronRight className="w-6 h-6" /></button>
//                       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">{currentImageIndex + 1} / {viewModalCar.images.length}</div>
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <div className="w-full h-[500px] flex items-center justify-center bg-gray-200 text-gray-500">No Images</div>
//               )}
//             </div>
//             <div className="p-8">
//               <div className="flex justify-between items-center mb-8 pb-6 border-b">
//                 <div>
//                   <p className="text-gray-600 text-sm mb-1">Price</p>
//                   <p className="text-5xl font-bold" style={{ color: "#2fa88a" }}>KSH{viewModalCar.price}</p>
//                 </div>
//                 <div className="px-6 py-3 rounded-full text-lg font-semibold" style={{ backgroundColor: viewModalCar.status === 'available' ? '#d1fae5' : viewModalCar.status === 'sold' ? '#fee2e2' : '#fef3c7', color: viewModalCar.status === 'available' ? '#065f46' : viewModalCar.status === 'sold' ? '#991b1b' : '#92400e' }}>{viewModalCar.status === 'available' ? 'Available' : viewModalCar.status === 'reserved' ? 'Reserved' : 'Sold'}</div>
//               </div>
//               <div className="mb-8">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                   <SpecCard icon={<Calendar />} label="Year" value={viewModalCar.year || "N/A"} />
//                   <SpecCard icon={<Gauge />} label="Mileage" value={viewModalCar.mileage || "N/A"} />
//                   <SpecCard icon={<Settings />} label="Trans" value={viewModalCar.transmission || "N/A"} />
//                   <SpecCard icon={<Fuel />} label="Fuel" value={viewModalCar.fuel || "N/A"} />
//                   <SpecCard icon={<Zap />} label="HP" value={viewModalCar.hp ? `${viewModalCar.hp} HP` : "N/A"} />
//                   <SpecCard icon={<Settings />} label="Engine" value={viewModalCar.engine ? `${viewModalCar.engine} CC` : "N/A"} />
//                   <SpecCard icon={<TrendingUp />} label="Torque" value={viewModalCar.torque_nm ? `${viewModalCar.torque_nm} Nm` : "N/A"} />
//                   <SpecCard icon={<Clock />} label="Top Speed" value={viewModalCar.top_speed_kmh ? `${viewModalCar.top_speed_kmh} km/h` : "N/A"} />
//                 </div>
//               </div>
//               {viewModalCar.description && (
//                 <div className="mb-6">
//                   <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
//                   <p className="text-gray-700 leading-relaxed text-lg">{viewModalCar.description}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const SpecCard = ({ icon, label, value }) => (
//   <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#2fa88a] transition-all">
//     <div className="text-[#2fa88a] mb-2">{icon}</div>
//     <p className="text-gray-600 text-sm mb-1">{label}</p>
//     <p className="font-bold text-gray-900 text-lg">{value}</p>
//   </div>
// );

// export default Inventory;

import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Zap,
  Settings,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  getCars,
  createCar,
  updateCarWithImages,
  deleteCar,
} from "../../utils/api";

const normalizeCar = (car) => ({
  id: car.id,
  // core
  model: car.model,
  name: car.name,
  price: car.price,
  final_price: car.final_price,
  discount_percent: car.discount_percent,
  status: car.status,
  year: car.year,
  location: car.location,
  // specs (DB → frontend)
  drive: car.drive_type,
  mileage: car.mileage,
  engine: car.engine_capacity_cc,
  fuel: car.fuel_type,
  hp: car.horsepower,
  transmission: car.transmission,
  torque: car.torque_nm,
  top_speed: car.top_speed_kmh,
  description: car.description,
  // images
  images: car.images || [],
});

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [viewModalCar, setViewModalCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const emptyForm = {
    model: "",
    name: "",
    price: "",
    discount_percent: 0,
    status: "available",
    year: "",
    location: "",
    drive: "",
    mileage: "",
    engine: "",
    fuel: "",
    hp: "",
    transmission: "",
    torque: "",
    top_speed: "",
    description: "",
  };

  const [formData, setFormData] = useState({ ...emptyForm });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      saveCar();
    }, 3000);
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await getCars();
      setCars(response.data.map(normalizeCar));
    } catch (error) {
      console.error("Error fetching cars:", error);
      showToast("Failed to fetch cars", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...urls]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreview[index]);
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const saveCar = async () => {
    if (!formData.model || !formData.name || !formData.price) {
      showToast("Please fill in Model, Name, and Price fields", "error");
      return;
    }

    try {
      const backendData = {
        model: formData.model,
        name: formData.name,
        price: formData.price,
        discount_percent: formData.discount_percent || 0,
        status: formData.status,
        year: formData.year ? Number(formData.year) : null,
        location: formData.location,
        drive_type: formData.drive,
        mileage: formData.mileage ? Number(formData.mileage) : null,
        engine_capacity_cc: formData.engine ? Number(formData.engine) : null,
        fuel_type: formData.fuel,
        horsepower: formData.hp ? Number(formData.hp) : null,
        transmission: formData.transmission,
        torque_nm: formData.torque ? Number(formData.torque) : null,
        top_speed_kmh: formData.top_speed ? Number(formData.top_speed) : null,
        description: formData.description,
      };

      if (editingCarId) {
        await updateCarWithImages(
          editingCarId,
          backendData,
          imageFiles,
          deletedImageIds,
        );
        showToast("Car updated successfully!", "success");
      } else {
        await createCar(backendData, imageFiles);
        showToast("Car added successfully!", "success");
      }

      fetchCars();
      setShowModal(false);
      setEditingCarId(null);
      setExistingImages([]);
      setDeletedImageIds([]);
      setImageFiles([]);
      setImagePreview([]);
      setFormData({ ...emptyForm });
    } catch (error) {
      console.error("Save car error:", error.response?.data || error);
      showToast(
        error.response?.data?.detail ||
          "Failed to save car. Check all required fields.",
        "error",
      );
    }
  };

  const handleDeleteClick = (car) => {
    setCarToDelete(car);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCar(carToDelete.id);
      setCars(cars.filter((car) => car.id !== carToDelete.id));
      setShowDeleteModal(false);
      setCarToDelete(null);
      showToast("Car deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting car:", error);
      showToast("Failed to delete car", "error");
    }
  };

  const nextImage = () => {
    if (viewModalCar?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === viewModalCar.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (viewModalCar?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? viewModalCar.images.length - 1 : prev - 1,
      );
    }
  };

  const removeExistingImage = (img) => {
    if (existingImages.length <= 1 && imageFiles.length === 0) {
      showToast("At least one image is required", "error");
      return;
    }

    setExistingImages(existingImages.filter((i) => i.id !== img.id));
    setDeletedImageIds((prev) => [...prev, img.id]);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {toast.show && (
        <div
          className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-semibold text-white animate-slideIn ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <span className="text-2xl">
            {toast.type === "success" ? "✓" : "✕"}
          </span>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Inventory</h1>
            <p className="text-gray-600 text-lg">
              {cars.length} vehicle{cars.length !== 1 ? "s" : ""} in stock
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({ ...emptyForm });
              setImageFiles([]);
              setImagePreview([]);
              setExistingImages([]);
              setDeletedImageIds([]);
              setEditingCarId(null);
              setShowModal(true);
            }}
            className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all text-white hover:shadow-xl hover:scale-105"
            style={{ backgroundColor: "#2fa88a" }}
          >
            + Add Stock
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div
                className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
                style={{ borderColor: "#2fa88a" }}
              ></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.map((car) => {
                const discount = Number(car.discount_percent) || 0;
                const originalPrice = Number(car.price) || 0;
                const discountedPrice = Number(car.final_price) || originalPrice;

                // Determine status styles
                const statusMap = {
                  available: {
                    text: "Available",
                    bg: "bg-green-100",
                    color: "text-green-800",
                  },
                  reserved: {
                    text: "Reserved",
                    bg: "bg-yellow-100",
                    color: "text-yellow-800",
                  },
                  sold: {
                    text: "Sold",
                    bg: "bg-red-100",
                    color: "text-red-800",
                  },
                };
                const status = statusMap[car.status] || statusMap.sold;

                return (
                  <div
                    key={car.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all hover:scale-105 relative"
                  >
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                        {parseInt(discount)}% OFF
                      </div>
                    )}

                    {/* Car Image */}
                    {car.images?.length > 0 ? (
                      <img
                        src={car.images[0].url}
                        alt={car.name}
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                        No Image
                      </div>
                    )}

                    <div className="p-5">
                      {/* Status Badge */}
                      <div className="mb-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>

                      {/* Car Name */}
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {car.model} {car.name}
                      </h3>

                      {/* Year & Transmission */}
                      <p className="text-gray-600 text-sm mb-3">
                        {car.year} • {car.transmission}
                      </p>

                      {/* Price Section */}
                      <p
                        className="text-2xl font-bold mb-4"
                        style={{ color: "#2fa88a" }}
                      >
                        {discount > 0 ? (
                          <>
                            {/* Discounted Price */}
                            <span className="mr-2">
                              {formatPrice(discountedPrice)}
                            </span><br />
                            {/* Original Price - Struck Through */}
                            <span className="line-through text-gray-400 text-lg">
                              {formatPrice(originalPrice)}
                            </span>
                          </>
                        ) : (
                          <span>{formatPrice(originalPrice)}</span>
                        )}
                      </p>

                      {/* View Details Button */}
                      <button
                        onClick={() => setViewModalCar(car)}
                        className="w-full text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-all"
                        style={{ backgroundColor: "#2fa88a" }}
                      >
                        View Details
                      </button>

                      {/* Edit/Delete Buttons */}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setFormData({
                              model: car.model,
                              name: car.name,
                              price: originalPrice,
                              discount_percent: discount,
                              status: car.status,
                              year: car.year,
                              location: car.location,
                              drive: car.drive,
                              mileage: car.mileage,
                              engine: car.engine,
                              fuel: car.fuel,
                              hp: car.hp,
                              transmission: car.transmission,
                              torque: car.torque,
                              top_speed: car.top_speed,
                              description: car.description,
                            });

                            setExistingImages(car.images || []);
                            setDeletedImageIds([]);
                            setImageFiles([]);
                            setImagePreview([]);
                            setEditingCarId(car.id);
                            setShowModal(true);
                          }}
                          className="flex-1 border-2 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all"
                          style={{ borderColor: "#2fa88a", color: "#2fa88a" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(car)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && carToDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Delete Vehicle
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vehicle?
            </p>

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <p className="font-bold text-lg text-gray-900">
                {carToDelete.model} {carToDelete.name}
              </p>
            </div>

            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setEditingCarId(null);
                  setFormData({ ...emptyForm });
                  setExistingImages([]);
                  setDeletedImageIds([]);
                  setImageFiles([]);
                  setImagePreview([]);
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b flex justify-between items-center rounded-t-3xl">
              <h2 className="text-3xl font-bold text-gray-900">
                {editingCarId ? "Edit Car" : "Add New Car"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCarId(null);
                  setFormData({ ...emptyForm });
                  setExistingImages([]);
                  setDeletedImageIds([]);
                  setImageFiles([]);
                  setImagePreview([]);
                }}
                className="text-gray-500 hover:text-black text-2xl"
              >
                <X />
              </button>
            </div>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {existingImages.map((img, idx) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.url}
                      alt={`Existing ${idx}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeExistingImage(img)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-8">
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                />
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {imagePreview.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${idx}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Car Model *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Car Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Price (KSH) *
                  </label>
                  <input
                    type="text"
                    value={
                      formData.price
                        ? new Intl.NumberFormat("en-KE").format(formData.price)
                        : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "");
                      setFormData({ ...formData, price: Number(raw) });
                    }}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percent || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_percent: Number(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter discount percentage"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Drive
                  </label>
                  <select
                    value={formData.drive}
                    onChange={(e) =>
                      setFormData({ ...formData, drive: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="fwd">Front-wheel drive</option>
                    <option value="rwd">Rear-wheel drive</option>
                    <option value="awd">All-wheel drive</option>
                    <option value="4wd">4-wheel drive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Mileage
                  </label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) =>
                      setFormData({ ...formData, mileage: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Engine
                  </label>
                  <input
                    type="number"
                    value={formData.engine}
                    onChange={(e) =>
                      setFormData({ ...formData, engine: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Fuel
                  </label>
                  <select
                    value={formData.fuel}
                    onChange={(e) =>
                      setFormData({ ...formData, fuel: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    HP
                  </label>
                  <input
                    type="number"
                    value={formData.hp}
                    onChange={(e) =>
                      setFormData({ ...formData, hp: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Trans
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) =>
                      setFormData({ ...formData, transmission: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Torque
                  </label>
                  <input
                    type="number"
                    value={formData.torque}
                    onChange={(e) =>
                      setFormData({ ...formData, torque: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Top Speed (km/h)
                  </label>
                  <input
                    type="number"
                    value={formData.top_speed}
                    onChange={(e) =>
                      setFormData({ ...formData, top_speed: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleClick}
                  disabled={loading}
                  className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center"
                  style={{ backgroundColor: "#2fa88a" }}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-t-transparent border-white"></div>
                      <span className="text-sm font-medium">Revving up...</span>
                    </div>
                  ) : editingCarId ? (
                    "Save Changes"
                  ) : (
                    "Add Car"
                  )}
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
        </div>
      )}

      {viewModalCar && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        >
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b flex justify-between items-center rounded-t-3xl">
              <div>
                <h2 className="text-4xl font-bold text-gray-900">
                  {viewModalCar.model} {viewModalCar.name}
                </h2>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {viewModalCar.location}
                </p>
              </div>
              <button
                onClick={() => {
                  setViewModalCar(null);
                  setCurrentImageIndex(0);
                }}
                className="text-gray-500 hover:text-black text-3xl"
              >
                <X />
              </button>
            </div>

            <div className="relative bg-black">
              {viewModalCar.images?.length > 0 ? (
                <>
                  <img
                    src={viewModalCar.images[currentImageIndex].url}
                    alt={viewModalCar.name}
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
                  No Images
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-8 pb-6 border-b">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Price</p>
                  {Number(viewModalCar.discount_percent) > 0 ? (
                    <div>
                      <p
                        className="text-3xl font-extrabold"
                        style={{ color: "#2fa88a" }}
                      >
                        {formatPrice(Number(viewModalCar.final_price))}
                      </p>
                      <p className="text-lg line-through text-gray-400">
                        {formatPrice(Number(viewModalCar.price))}
                      </p>
                      <p className="text-lg text-white text-center rounded-lg bg-red-500 font-bold mt-2">
                        {Math.round(Number(viewModalCar.discount_percent))}% OFF
                      </p>
                    </div>
                  ) : (
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "#2fa88a" }}
                    >
                      {formatPrice(Number(viewModalCar.price))}
                    </p>
                  )}
                </div>
                <div
                  className="px-6 py-3 rounded-full text-lg font-semibold"
                  style={{
                    backgroundColor:
                      viewModalCar.status === "available"
                        ? "#d1fae5"
                        : viewModalCar.status === "sold"
                          ? "#fee2e2"
                          : "#fef3c7",
                    color:
                      viewModalCar.status === "available"
                        ? "#065f46"
                        : viewModalCar.status === "sold"
                          ? "#991b1b"
                          : "#92400e",
                  }}
                >
                  {viewModalCar.status === "available"
                    ? "Available"
                    : viewModalCar.status === "reserved"
                      ? "Reserved"
                      : "Sold"}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <SpecCard
                    icon={<Calendar />}
                    label="Year"
                    value={viewModalCar.year || "N/A"}
                  />
                  <SpecCard
                    icon={<Gauge />}
                    label="Mileage"
                    value={viewModalCar.mileage || "N/A"}
                  />
                  <SpecCard
                    icon={<Settings />}
                    label="Trans"
                    value={viewModalCar.transmission || "N/A"}
                  />
                  <SpecCard
                    icon={<Fuel />}
                    label="Fuel"
                    value={viewModalCar.fuel || "N/A"}
                  />
                  <SpecCard
                    icon={<Zap />}
                    label="HP"
                    value={viewModalCar.hp ? `${viewModalCar.hp} HP` : "N/A"}
                  />
                  <SpecCard
                    icon={<Settings />}
                    label="Engine"
                    value={
                      viewModalCar.engine ? `${viewModalCar.engine} CC` : "N/A"
                    }
                  />
                  <SpecCard
                    icon={<TrendingUp />}
                    label="Torque"
                    value={
                      viewModalCar.torque ? `${viewModalCar.torque} Nm` : "N/A"
                    }
                  />
                  <SpecCard
                    icon={<Clock />}
                    label="Top Speed"
                    value={
                      viewModalCar.top_speed
                        ? `${viewModalCar.top_speed} km/h`
                        : "N/A"
                    }
                  />
                </div>
              </div>

              {viewModalCar.description && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {viewModalCar.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SpecCard = ({ icon, label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#2fa88a] transition-all">
    <div className="text-[#2fa88a] mb-2">{icon}</div>
    <p className="text-gray-600 text-sm mb-1">{label}</p>
    <p className="font-bold text-gray-900 text-lg">{value}</p>
  </div>
);

export default Inventory;