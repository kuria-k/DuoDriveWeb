import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const Sales = () => {
  const [sales, setSales] = useState([
    { id: 1, customer: "John Doe", car: "BMW X5", amount: "$48,000", status: "Completed", date: "2026-01-15" },
    { id: 2, customer: "Jane Smith", car: "Toyota Camry", amount: "$25,000", status: "Pending", date: "2026-01-16" },
    { id: 3, customer: "Mike Johnson", car: "Tesla Model 3", amount: "$42,000", status: "Completed", date: "2026-01-17" },
    { id: 4, customer: "Sarah Williams", car: "Honda Civic", amount: "$22,000", status: "Pending", date: "2026-01-18" },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [formData, setFormData] = useState({ customer: "", car: "", amount: "", status: "Pending", date: "" });

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setFormData({ customer: sale.customer, car: sale.car, amount: sale.amount, status: sale.status, date: sale.date });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    setSales(sales.map((s) => (s.id === selectedSale.id ? { ...s, ...formData } : s)));
    setShowEditModal(false);
    setSelectedSale(null);
  };

  const addSale = () => {
    const newSale = {
      id: sales.length + 1,
      ...formData,
    };
    setSales([...sales, newSale]);
    setShowAddModal(false);
    setFormData({ customer: "", car: "", amount: "", status: "Pending", date: "" });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Sales & Transactions</h1>
        <button
          onClick={() => {
            setFormData({ customer: "", car: "", amount: "", status: "Pending", date: new Date().toISOString().split('T')[0] });
            setShowAddModal(true);
          }}
          className="px-6 py-3 rounded-lg font-medium shadow-lg transition-all text-white hover:opacity-90"
          style={{ backgroundColor: "#2fa88a" }}
        >
          + Add Sale
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="text-white" style={{ background: "linear-gradient(135deg, #2fa88a 0%, #2d6a4f 100%)" }}>
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Car</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-black">{sale.customer}</td>
                <td className="p-4 text-gray-700">{sale.car}</td>
                <td className="p-4 text-gray-700 font-semibold">{sale.amount}</td>
                <td className="p-4 text-gray-700">{sale.date}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sale.status === "Completed"
                        ? "text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                    style={sale.status === "Completed" ? { backgroundColor: "#2fa88a" } : {}}
                  >
                    {sale.status}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => handleEdit(sale)}
                    className="font-medium hover:opacity-70"
                    style={{ color: "#2fa88a" }}
                  >
                    Edit
                  </button>
                  <button className="font-medium hover:opacity-70" style={{ color: "#1a4d2e" }}>
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <GlassModal onClose={() => setShowEditModal(false)} title="Edit Sale">
          <input
            type="text"
            placeholder="Customer Name"
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-gray-400"
          />
          <input
            type="text"
            placeholder="Car"
            value={formData.car}
            onChange={(e) => setFormData({ ...formData, car: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-gray-400"
          />
          <input
            type="text"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-gray-400"
          />
          <input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-gray-400"
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-400"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex gap-3">
            <button
              onClick={saveEdit}
              className="flex-1 text-white py-3 rounded-lg font-medium hover:opacity-90"
              style={{ backgroundColor: "#2fa88a" }}
            >
              Save Changes
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </GlassModal>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <GlassModal onClose={() => setShowAddModal(false)} title="Add New Sale">
          <input
            type="text"
            placeholder="Customer Name"
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-gray-400"
          />
          <input
            type="text"
            placeholder="Car"
            value={formData.car}
            onChange={(e) => setFormData({ ...formData, car: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-gray-400"
          />
          <input
            type="text"
            placeholder="Amount (e.g., $25,000)"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-gray-400"
          />
          <input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-gray-400"
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-400"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex gap-3">
            <button
              onClick={addSale}
              className="flex-1 text-white py-3 rounded-lg font-medium hover:opacity-90"
              style={{ backgroundColor: "#2fa88a"}}
            >
              Add Sale
            </button>
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

// Glassmorphism Modal Component
const GlassModal = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(8px)" }}>
      <div
        className="relative rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl"
          >
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Sales;