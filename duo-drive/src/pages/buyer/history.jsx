import React from "react";

const BuyerHistory = () => {
  const history = [
    { id: 1, action: "Booked Test Drive", car: "Toyota Corolla", date: "Jan 20, 2026" },
    { id: 2, action: "Sent Inquiry", car: "Honda Civic", date: "Jan 22, 2026" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Activity History</h1>
      <ul className="space-y-4">
        {history.map((item) => (
          <li key={item.id} className="bg-white shadow rounded-lg p-4">
            <p className="font-semibold">{item.action}</p>
            <p className="text-gray-600">{item.car}</p>
            <p className="text-xs text-gray-400">{item.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyerHistory;
