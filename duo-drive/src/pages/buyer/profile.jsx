import React, { useEffect, useState } from "react";
import { FaUserCircle, FaEnvelope, FaIdBadge, FaStar } from "react-icons/fa";
import axios from "axios";

const BuyerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/users/me/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        setUser(response.data);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-6">
          {error}
        </div>
      </div>
    );
  }

  // Generate initials if no avatar
  const initials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  // Optional: Profile completion percentage
  const completion = Math.min(
    100,
    ["username", "email", "role"].filter((f) => user[f]).length * 33
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Greeting */}
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
        Hey, {user?.username || "there"}! 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Here's your personalized profile. Everything about your account credentials is right
        here!
      </p>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-xl rounded-2xl p-8 space-y-6 transition-all hover:shadow-2xl hover:scale-[1.01] duration-300">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-700 text-white text-3xl font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
            <p className="text-gray-500 capitalize">
              {user?.is_superuser ? "Superuser (Admin)" : `${user?.role} account`}
            </p>
          </div>
        </div>

        {/* Profile Stats / Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <FaIdBadge className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-semibold">{user?.phone_number}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <FaEnvelope className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{user?.email}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <FaStar className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-semibold">
              {user?.is_superuser ? "Admin" : user?.role}
            </p>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mt-6">
          <p className="text-gray-600 mb-2 font-medium">Profile Completion</p>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-green-600 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{completion}% completed</p>
        </div>

        {/* Friendly Message */}
        {/* <div className="mt-6 bg-green-50 p-4 rounded-xl text-green-800 border-l-4 border-green-600">
          <p>
            Welcome back, <span className="font-semibold">{user?.username}</span>! 🎉
            Explore the inventory, save your favourite cars, and keep track of your
            history right here.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default BuyerProfile;

