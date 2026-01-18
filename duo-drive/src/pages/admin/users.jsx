import React, { useState } from "react";
import { X, Search, Mail, Shield, User, AlertCircle, CheckCircle, Clock, TrendingUp, UserPlus, Edit2, Trash2 } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: "John Doe", 
      email: "john@email.com", 
      activity: "Viewed BMW X5", 
      role: "Customer",
      status: "Active",
      joinDate: "Jan 15, 2024",
      listings: 0,
      lastActive: "2 hours ago"
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "jane@email.com", 
      activity: "Purchased Camry", 
      role: "Seller",
      status: "Active",
      joinDate: "Dec 10, 2023",
      listings: 12,
      lastActive: "1 day ago"
    },
    { 
      id: 3, 
      name: "Mike Admin", 
      email: "mike@email.com", 
      activity: "Added inventory", 
      role: "Admin",
      status: "Active",
      joinDate: "Nov 5, 2023",
      listings: 0,
      lastActive: "5 minutes ago"
    },
    { 
      id: 4, 
      name: "Sarah Johnson", 
      email: "sarah@email.com", 
      activity: "Updated profile", 
      role: "Seller",
      status: "Pending",
      joinDate: "Jan 18, 2024",
      listings: 3,
      lastActive: "3 hours ago"
    },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    role: "Customer",
    status: "Active"
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role,
      status: user.status 
    });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const saveEdit = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }
    setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...formData } : u)));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const addUser = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }
    const newUser = {
      id: Date.now(),
      ...formData,
      activity: "New user",
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      listings: 0,
      lastActive: "Just now"
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setFormData({ name: "", email: "", role: "Customer", status: "Active" });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    const matchesStatus = filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "Active").length,
    sellers: users.filter(u => u.role === "Seller").length,
    pending: users.filter(u => u.status === "Pending").length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage customers, sellers, and administrators</p>
          </div>
          <button
            onClick={() => {
              setFormData({ name: "", email: "", role: "Customer", status: "Active" });
              setShowAddModal(true);
            }}
            className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all text-white hover:shadow-xl hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: "#2fa88a" }}
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard 
            icon={<User className="w-6 h-6" />}
            label="Total Users"
            value={stats.total}
            color="#2fa88a"
          />
          <StatCard 
            icon={<CheckCircle className="w-6 h-6" />}
            label="Active Users"
            value={stats.active}
            color="#10b981"
          />
          <StatCard 
            icon={<TrendingUp className="w-6 h-6" />}
            label="Sellers"
            value={stats.sellers}
            color="#3b82f6"
          />
          <StatCard 
            icon={<Clock className="w-6 h-6" />}
            label="Pending Approval"
            value={stats.pending}
            color="#f59e0b"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#2fa88a] focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#2fa88a] focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Customer">Customer</option>
              <option value="Seller">Seller</option>
              <option value="Admin">Admin</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#2fa88a] focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-white" style={{ background: "linear-gradient(135deg, #2fa88a 0%, #1a7a63 100%)" }}>
              <tr>
                <th className="p-4 text-left font-semibold">User</th>
                <th className="p-4 text-left font-semibold">Role</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Listings</th>
                <th className="p-4 text-left font-semibold">Last Active</th>
                <th className="p-4 text-left font-semibold">Join Date</th>
                <th className="p-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`border-t hover:bg-gray-50 transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                           style={{ backgroundColor: "#2fa88a" }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "Seller"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {user.role === "Admin" && <Shield className="w-3 h-3" />}
                      {user.role === "Seller" && <TrendingUp className="w-3 h-3" />}
                      {user.role === "Customer" && <User className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : user.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status === "Active" && <CheckCircle className="w-3 h-3" />}
                      {user.status === "Pending" && <Clock className="w-3 h-3" />}
                      {user.status === "Inactive" && <AlertCircle className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-gray-900">{user.listings}</span>
                    <span className="text-gray-500 text-sm"> cars</span>
                  </td>
                  <td className="p-4 text-gray-700 text-sm">{user.lastActive}</td>
                  <td className="p-4 text-gray-700 text-sm">{user.joinDate}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <User className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">No users found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                     style={{ backgroundColor: "#2fa88a" }}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Role" value={selectedUser.role} />
                <DetailItem label="Status" value={selectedUser.status} />
                <DetailItem label="Join Date" value={selectedUser.joinDate} />
                <DetailItem label="Last Active" value={selectedUser.lastActive} />
                <DetailItem label="Total Listings" value={`${selectedUser.listings} cars`} />
                <DetailItem label="Recent Activity" value={selectedUser.activity} />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(selectedUser);
                  }}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all"
                  style={{ backgroundColor: "#2fa88a" }}
                >
                  Edit User
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <FormModal
          title="Edit User"
          formData={formData}
          setFormData={setFormData}
          onSave={saveEdit}
          onClose={() => setShowEditModal(false)}
          submitLabel="Save Changes"
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <FormModal
          title="Add New User"
          formData={formData}
          setFormData={setFormData}
          onSave={addUser}
          onClose={() => setShowAddModal(false)}
          submitLabel="Add User"
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete User</h2>
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all"
              >
                Delete User
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20`, color: color }}>
        {icon}
      </div>
    </div>
  </div>
);

// Detail Item Component
const DetailItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

// Form Modal Component
const FormModal = ({ title, formData, setFormData, onSave, onClose, submitLabel }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">User Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
          >
            <option value="Customer">Customer</option>
            <option value="Seller">Seller</option>
            {/* <option value="Admin">Admin</option> */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onSave}
          className="flex-1 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
          style={{ backgroundColor: "#2fa88a" }}
        >
          {submitLabel}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default Users;