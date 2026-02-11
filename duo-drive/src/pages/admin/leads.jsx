import React, { useEffect, useMemo, useState } from "react";
import { FaTimes, FaCheck, FaTrash, FaEye, FaEnvelope, FaPhone, FaClock, FaFilter, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { getContacts, updateContact, deleteContact } from "../../utils/api";

const SUBJECTS = [
  { key: "all", label: "All Subjects" },
  { key: "General", label: "General Inquiry" },
  { key: "Vehicle", label: "Vehicle Inquiry" },
  { key: "Test_drive", label: "Test Drive" },
  { key: "Financing", label: "Financing" },
];

const STATUS_FILTERS = [
  { key: "all", label: "All Status" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
];

const normalizeLead = (lead) => ({
  ...lead,
  status: lead.status || "pending",
  subject_type: lead.subject_type || "General",
});

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const itemsPerPage = 8;

  useEffect(() => {
    fetchLeads();
  }, []);

 const fetchLeads = async () => {
  try {
    const res = await getContacts();
    const contacts = Array.isArray(res) ? res : res.data || []; // handle both cases
    setLeads(contacts.map(normalizeLead));
  } catch (error) {
    console.error("Error fetching leads:", error);
    showToast("Failed to fetch leads", "error");
  }
};



  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const markCompleted = async (id) => {
  try {
    const response = await updateContact(id, { status: "completed" });
    console.log("Database update response:", response.data);

    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "completed" } : l))
    );

    showToast("Lead marked as completed!", "success");
  } catch (error) {
    console.error("Error updating lead:", error);
    console.error("Error details:", error.response?.data);
    showToast(
      `Failed to update lead: ${error.response?.data?.message || error.message}`,
      "error"
    );
  }
};

  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteContact(leadToDelete.id);
      setLeads((prev) => prev.filter((l) => l.id !== leadToDelete.id));
      setShowDeleteModal(false);
      setLeadToDelete(null);
      showToast("Lead deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting lead:", error);
      showToast("Failed to delete lead", "error");
    }
  };

  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // Apply subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((l) => l.subject_type === subjectFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.email.toLowerCase().includes(query) ||
          (l.phone_number && l.phone_number.toLowerCase().includes(query)) ||
          l.message.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [leads, subjectFilter, statusFilter, searchQuery]);

  const stats = useMemo(
    () => ({
      total: leads.length,
      pending: leads.filter((l) => l.status === "pending").length,
      completed: leads.filter((l) => l.status === "completed").length,
    }),
    [leads]
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [subjectFilter, statusFilter, searchQuery]);

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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Customer Leads</h1>
          <p className="text-gray-600">Manage customer enquiries and follow-ups</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 cursor-pointer hover:shadow-xl transition-shadow"
            style={{ borderColor: "#2fa88a" }}
            onClick={() => setStatusFilter("all")}
          >
            <p className="text-gray-600 text-sm font-medium mb-1">Total Leads</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setStatusFilter("pending")}
          >
            <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
          </div>
          <div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setStatusFilter("completed")}
          >
            <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
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

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaFilter /> Status
            </label>
            <div className="flex flex-wrap gap-3">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                    statusFilter === s.key
                      ? "text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                  }`}
                  style={statusFilter === s.key ? { backgroundColor: "#2fa88a" } : {}}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaFilter /> Subject Type
            </label>
            <div className="flex flex-wrap gap-3">
              {SUBJECTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSubjectFilter(s.key)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                    subjectFilter === s.key
                      ? "text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                  }`}
                  style={subjectFilter === s.key ? { backgroundColor: "#2fa88a" } : {}}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {currentLeads.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? `No leads found matching "${searchQuery}"`
                  : "No leads found"}
              </p>
              {(searchQuery || subjectFilter !== "all" || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSubjectFilter("all");
                    setStatusFilter("all");
                  }}
                  className="mt-4 px-6 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#2fa88a" }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {currentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-800">
                            {lead.name}
                          </h3>
                          <StatusBadge status={lead.status} />
                          <SubjectBadge subject={lead.subject_type} />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <span>{lead.email}</span>
                          </div>
                          {lead.phone_number && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-gray-400" />
                              <span>{lead.phone_number}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-400" />
                            <span>
                              {new Date(lead.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {lead.message}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <FaEye /> View Details
                      </button>

                      {lead.status === "pending" && (
                        <button
                          onClick={() => markCompleted(lead.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
                          style={{ backgroundColor: "#2fa88a" }}
                        >
                          <FaCheck /> Mark Complete
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteClick(lead)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, filteredLeads.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredLeads.length}</span> results
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
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
        {showDeleteModal && leadToDelete && (
          <GlassModal onClose={() => setShowDeleteModal(false)} title="Delete Lead">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-600 text-2xl" />
              </div>
              <p className="text-gray-700 text-lg mb-2">
                Are you sure you want to delete this lead?
              </p>
              <p className="text-gray-500 text-sm">
                <span className="font-semibold">{leadToDelete.name}</span> -{" "}
                {leadToDelete.email}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
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

        {/* Lead Details Modal */}
        {selectedLead && (
          <GlassModal
            onClose={() => setSelectedLead(null)}
            title="Lead Details"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <StatusBadge status={selectedLead.status} />
                <SubjectBadge subject={selectedLead.subject_type} />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Name</label>
                <p className="text-gray-800 font-medium">{selectedLead.name}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <FaEnvelope /> Email
                </label>
                <p className="text-gray-800">{selectedLead.email}</p>
              </div>

              {selectedLead.phone_number && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <FaPhone /> Phone
                  </label>
                  <p className="text-gray-800">{selectedLead.phone_number}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <FaClock /> Received
                </label>
                <p className="text-gray-800">
                  {new Date(selectedLead.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Message</label>
                <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {selectedLead.message}
                </p>
              </div>

              {selectedLead.status === "pending" && (
                <button
                  onClick={() => {
                    markCompleted(selectedLead.id);
                    setSelectedLead(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#2fa88a" }}
                >
                  <FaCheck /> Mark as Completed
                </button>
              )}
            </div>
          </GlassModal>
        )}
      </div>
    </div>
  );
};

/* ---------- UI Components ---------- */

const StatusBadge = ({ status = "pending" }) => (
  <span
    className={`px-3 py-1 text-xs font-semibold rounded-full ${
      status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-green-100 text-green-800"
    }`}
  >
    {status.toUpperCase()}
  </span>
);

const SubjectBadge = ({ subject = "General" }) => {
  const displaySubject = subject.replace("_", " ");
  return (
    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
      {displaySubject.toUpperCase()}
    </span>
  );
};

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

export default LeadsPage;
