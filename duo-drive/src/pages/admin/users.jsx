import React, { useState, useEffect } from "react";
import { X, Search, Mail, Shield, User, AlertCircle, CheckCircle, Clock, TrendingUp, UserPlus, Edit2, Trash2 } from "lucide-react";
import { getUsers } from "../../utils/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    role: "customer",
    status: "Active"
  });

  // Fetch users from API on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return formatDate(dateString);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      
      // Transform backend data to match frontend structure
      const transformedUsers = data.map((user) => ({
        id: user.id,
        name: user.username,
        email: user.email,
        phone: user.phone_number || "N/A",
        role: getRoleLabel(user.role, user.is_superuser),
        roleValue: user.role,
        isSuperuser: user.is_superuser,
        status: "Active", // You can add status field to your backend model if needed
        activity: "Recent activity",
        joinDate: formatDate(user.date_joined), // Use real date_joined
        joinDateRaw: user.date_joined, // Keep raw date for sorting/filtering
        listings: 0, // You can calculate this based on user's listings
        lastActive: getTimeAgo(user.date_joined) // You can replace with last_login if available
      }));
      
      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get role label
  const getRoleLabel = (role, isSuperuser) => {
    if (isSuperuser) return "Admin";
    if (role === "seller") return "Seller";
    return "Customer";
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.name,
      email: user.email,
      phone_number: user.phone || "",
      role: user.roleValue,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // TODO: Implement delete API call
      // await deleteUser(selectedUser.id);
      
      // For now, just filter locally
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  const saveEdit = async () => {
    if (!formData.username || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // TODO: Implement update API call
      // await updateUser(selectedUser.id, formData);
      
      // For now, update locally
      setUsers(users.map((u) => 
        u.id === selectedUser.id 
          ? { 
              ...u, 
              name: formData.username,
              email: formData.email,
              phone: formData.phone_number,
              role: getRoleLabel(formData.role, false),
              roleValue: formData.role,
              status: formData.status
            } 
          : u
      ));
      
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user. Please try again.");
    }
  };

  const addUser = async () => {
    if (!formData.username || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // TODO: Implement create API call
      // const newUser = await createUser(formData);
      
      // For now, add locally
      const newUser = {
        id: Date.now(),
        name: formData.username,
        email: formData.email,
        phone: formData.phone_number || "N/A",
        role: getRoleLabel(formData.role, false),
        roleValue: formData.role,
        status: formData.status,
        activity: "New user",
        joinDate: formatDate(new Date().toISOString()),
        joinDateRaw: new Date().toISOString(),
        listings: 0,
        lastActive: "Just now"
      };
      
      setUsers([...users, newUser]);
      setShowAddModal(false);
      setFormData({ username: "", email: "", phone_number: "", role: "customer", status: "Active" });
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user. Please try again.");
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2fa88a] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-6 py-2 bg-[#2fa88a] text-white rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage customers, sellers, and administrators</p>
        </div>
        <button
          onClick={() => {
            setFormData({ username: "", email: "", phone_number: "", role: "customer", status: "Active" });
            setShowAddModal(true);
          }}
          className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all text-white hover:shadow-xl hover:scale-105 flex items-center gap-2"
          style={{ backgroundColor: "#2fa88a" }}
        >
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<User size={24} />} label="Total Users" value={stats.total} color="#2fa88a" />
        <StatCard icon={<CheckCircle size={24} />} label="Active Users" value={stats.active} color="#10b981" />
        <StatCard icon={<TrendingUp size={24} />} label="Sellers" value={stats.sellers} color="#3b82f6" />
        <StatCard icon={<Clock size={24} />} label="Pending Approval" value={stats.pending} color="#f59e0b" />
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#2fa88a] focus:outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#2fa88a] focus:outline-none"
          >
            <option>All Roles</option>
            <option>Customer</option>
            <option>Seller</option>
            <option>Admin</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#2fa88a] focus:outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Join Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Membership Period</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: "#2fa88a" }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === "Admin" && <Shield size={16} className="text-red-500" />}
                      {user.role === "Seller" && <TrendingUp size={16} className="text-blue-500" />}
                      {user.role === "Customer" && <User size={16} className="text-gray-500" />}
                      <span className="text-sm font-medium text-gray-900">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                      user.status === "Active" ? "bg-green-100 text-green-700" :
                      user.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {user.status === "Active" && <CheckCircle size={12} />}
                      {user.status === "Pending" && <Clock size={12} />}
                      {user.status === "Inactive" && <AlertCircle size={12} />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Mail size={18} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 size={18} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-black">
                <X size={24} />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: "#2fa88a" }}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
              <p className="text-gray-500">{selectedUser.email}</p>
            </div>

            <div className="space-y-4 mb-6">
              <DetailItem label="Role" value={selectedUser.role} />
              <DetailItem label="Status" value={selectedUser.status} />
              <DetailItem label="Phone" value={selectedUser.phone} />
              <DetailItem label="Join Date" value={selectedUser.joinDate} />
              <DetailItem label="Membership Period" value={selectedUser.lastActive} />
            </div>

            <div className="flex gap-3">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete User</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
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
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-600 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <div style={{ color }}>{icon}</div>
      </div>
    </div>
  </div>
);

// Detail Item Component
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-900 font-semibold">{value}</span>
  </div>
);

// Form Modal Component
const FormModal = ({ title, formData, setFormData, onSave, onClose, submitLabel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Username *</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
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
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#2fa88a] focus:outline-none"
          >
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSave}
          className="flex-1 py-3 rounded-xl font-semibold text-white transition-all"
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