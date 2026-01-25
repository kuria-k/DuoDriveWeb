import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import { getSales, createSale, updateSale, deleteSale } from "../../utils/api";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    customer: "",
    car: "",
    amount: "",
    status: "available",
    date: "",
  });

  const itemsPerPage = 10;

  // Toast notification helper
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Load sales from backend on mount
  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await getSales();
      const salesData = Array.isArray(response.data) ? response.data : [];
      setSales(salesData);
      setFilteredSales(salesData);
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSales([]);
      setFilteredSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter sales based on period
  useEffect(() => {
    filterSalesByPeriod(filterPeriod);
  }, [filterPeriod, sales]);

  // Apply search filter
  useEffect(() => {
    applySearchFilter();
  }, [searchQuery, sales, filterPeriod]);

  const applySearchFilter = () => {
    let filtered = filterSalesByPeriodHelper(filterPeriod);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sale) =>
          sale.customer.toLowerCase().includes(query) ||
          sale.car.toLowerCase().includes(query),
      );
    }

    setFilteredSales(filtered);
    setCurrentPage(1);
  };

  const filterSalesByPeriodHelper = (period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered = Array.isArray(sales) ? [...sales] : [];

    if (period === "today") {
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate >= today;
      });
    } else if (period === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((sale) => new Date(sale.date) >= weekAgo);
    } else if (period === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter((sale) => new Date(sale.date) >= monthAgo);
    } else if (period === "year") {
      const yearAgo = new Date(today);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      filtered = filtered.filter((sale) => new Date(sale.date) >= yearAgo);
    }

    return filtered;
  };

  const filterSalesByPeriod = (period) => {
    setFilterPeriod(period);
  };

  // Calculate statistics
  const calculateStats = () => {
    const salesArray = Array.isArray(filteredSales) ? filteredSales : [];
    const totalSales = salesArray.reduce(
      (sum, sale) => sum + parseFloat(sale.amount || 0),
      0,
    );
    const soldSales = salesArray.filter((s) => s.status === "sold").length;
    const availableSales = salesArray.filter(
      (s) => s.status === "available",
    ).length;
    const reservedSales = salesArray.filter(
      (s) => s.status === "reserved",
    ).length;

    return {
      total: totalSales,
      count: salesArray.length,
      sold: soldSales,
      available: availableSales,
      reserved: reservedSales,
    };
  };

  const stats = calculateStats();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const salesArray = Array.isArray(filteredSales) ? filteredSales : [];
  const currentSales = salesArray.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(salesArray.length / itemsPerPage);

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setFormData({
      customer: sale.customer,
      car: sale.car,
      amount: sale.amount,
      status: sale.status,
      date: sale.date,
    });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      await updateSale(selectedSale.id, formData);
      fetchSales(); // refresh list
      setShowEditModal(false);
      setSelectedSale(null);
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  const addSale = async () => {
    try {
      // Remove date field since backend auto-generates it
      const { date, ...saleData } = formData;
      await createSale(saleData);
      fetchSales(); // refresh list
      setShowAddModal(false);
      setFormData({
        customer: "",
        car: "",
        amount: "",
        status: "available",
        date: "",
      });
      showToast("Sale added successfully!", "success");
    } catch (error) {
      console.error("Error creating sale:", error);
      console.error("Error response:", error.response?.data);
      showToast("Failed to add sale", "error");
    }
  };

  const removeSale = async (id) => {
    setShowDeleteModal(false);
    try {
      await deleteSale(id);
      fetchSales(); // refresh list
      showToast("Sale deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting sale:", error);
      showToast("Failed to delete sale", "error");
    }
  };

  const handleDeleteClick = (sale) => {
    setSelectedSale(sale);
    setShowDeleteModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const filterButtons = [
    { label: "Today", value: "today", icon: FaCalendarDay },
    { label: "Week", value: "week", icon: FaCalendarWeek },
    { label: "Month", value: "month", icon: FaCalendarAlt },
    { label: "Year", value: "year", icon: FaCalendar },
    { label: "All Time", value: "all", icon: FaCalendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md ${
              toast.type === "success"
                ? "bg-white/90 border-l-4"
                : "bg-red-50/90 border-l-4 border-red-500"
            }`}
            style={toast.type === "success" ? { borderColor: "#2fa88a" } : {}}
          >
            {toast.type === "success" ? (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: "#2fa88a" }}
              >
                <FaCheck size={16} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                <FaTimes size={16} />
              </div>
            )}
            <span className="font-medium text-gray-800">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sales & Transactions
          </h1>
          <p className="text-gray-600">
            Manage and track your sales performance
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filterButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.value}
                onClick={() => setFilterPeriod(btn.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                  filterPeriod === btn.value
                    ? "text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                }`}
                style={
                  filterPeriod === btn.value
                    ? { backgroundColor: "#2fa88a" }
                    : {}
                }
              >
                <Icon className="text-sm" />
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{ focusRing: "#2fa88a" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4"
            style={{ borderColor: "#2fa88a" }}
          >
            <p className="text-gray-600 text-sm font-medium mb-1">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency: "KES",
                minimumFractionDigits: 0,
              }).format(stats.total)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-1">
              Total Sales
            </p>
            <p className="text-3xl font-bold text-gray-800">{stats.count}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Sold</p>
            <p className="text-3xl font-bold text-gray-800">{stats.sold}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Available</p>
            <p className="text-3xl font-bold text-gray-800">
              {stats.available}
            </p>
          </div>
        </div>

        {/* Add Sale Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setFormData({
                customer: "",
                car: "",
                amount: "",
                status: "available",
                date: "",
              });
              setShowAddModal(true);
            }}
            className="px-6 py-3 rounded-lg font-medium shadow-lg transition-all text-white hover:opacity-90"
            style={{ backgroundColor: "#2fa88a" }}
          >
            + Add Sale
          </button>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: "#2fa88a" }}
              ></div>
            </div>
          ) : currentSales.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? `No sales found matching "${searchQuery}"`
                  : "No sales found for this period"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#2fa88a" }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead
                    className="bg-gray-50 border-b-2"
                    style={{ borderColor: "#2fa88a" }}
                  >
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Car
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {sale.car}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {new Intl.NumberFormat("en-KE", {
                            style: "currency",
                            currency: "KES",
                            minimumFractionDigits: 0,
                          }).format(sale.amount)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              sale.status === "sold"
                                ? "bg-green-100 text-green-800"
                                : sale.status === "available"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {sale.status.charAt(0).toUpperCase() +
                              sale.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                          <button
                            onClick={() => handleEdit(sale)}
                            className="font-medium hover:opacity-70 transition-opacity"
                            style={{ color: "#2fa88a" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(sale)}
                            className="font-medium text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstItem + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, salesArray.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{salesArray.length}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaChevronLeft className="h-4 w-4" />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? "text-white border-transparent"
                                : "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
                            }`}
                            style={
                              currentPage === i + 1
                                ? { backgroundColor: "#2fa88a" }
                                : {}
                            }
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaChevronRight className="h-4 w-4" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedSale && (
          <GlassModal
            onClose={() => setShowDeleteModal(false)}
            title="Delete Sale"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-600 text-2xl" />
              </div>
              <p className="text-gray-700 text-lg mb-2">
                Are you sure you want to delete this sale?
              </p>
              <p className="text-gray-500 text-sm">
                <span className="font-semibold">{selectedSale.customer}</span> -{" "}
                {selectedSale.car}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => removeSale(selectedSale.id)}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </GlassModal>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <GlassModal onClose={() => setShowEditModal(false)} title="Edit Sale">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customer}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ focusRingColor: "#2fa88a" }}
            />
            <input
              type="text"
              placeholder="Car Model"
              value={formData.car}
              onChange={(e) =>
                setFormData({ ...formData, car: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={saveEdit}
                className="flex-1 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
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
          <GlassModal
            onClose={() => setShowAddModal(false)}
            title="Add New Sale"
          >
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customer}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="text"
              placeholder="Car Model"
              value={formData.car}
              onChange={(e) =>
                setFormData({ ...formData, car: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={addSale}
                className="flex-1 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#2fa88a" }}
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
    </div>
  );
};

// Glassmorphism Modal Component
const GlassModal = ({ onClose, title, children }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 border border-white/20"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Sales;
