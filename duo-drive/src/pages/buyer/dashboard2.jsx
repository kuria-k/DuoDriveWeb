import React from "react";

const BuyerDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>
      <p className="text-gray-600">
        Welcome back! Here’s a quick overview of your activity:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold">Upcoming Test Drives</h2>
          <p className="text-sm text-gray-500">You have 2 scheduled this week.</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold">Favourites</h2>
          <p className="text-sm text-gray-500">3 cars saved in your wishlist.</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold">Messages</h2>
          <p className="text-sm text-gray-500">You have 5 unread messages.</p>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
