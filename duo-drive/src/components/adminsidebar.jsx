import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaUsers,
  FaMoneyBillWave,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const jungleGreen = "#2fa88a";

  const menuItems = [
    {
      name: "Dashboard",
      icon: FaTachometerAlt,
      link: "/admin/dashboard",
    },
    {
      name: "Inventory",
      icon: FaCar,
      link: "/admin/inventory",
    },
    {
      name: "Users",
      icon: FaUsers,
      link: "/admin/users",
    },
    {
      name: "Sales",
      icon: FaMoneyBillWave,
      link: "/admin/sales",
    },
  ];

  return (
    <aside
      className={`h-screen bg-white border-r flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: jungleGreen }}
          >
            <FaCar className="text-white" />
          </div>

          {!collapsed && (
            <span
              className="text-lg font-bold tracking-wide"
              style={{ color: jungleGreen }}
            >
              DuoDrive Admin
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-600"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4">
        {!collapsed && (
          <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </p>
        )}

        <ul className="space-y-1">
          {menuItems.map(({ name, icon: Icon, link }) => (
            <li key={name}>
              <NavLink
  to={link}
  className={({ isActive }) =>
    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
    ${
      isActive
        ? "text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`
  }
  style={({ isActive }) => ({
    backgroundColor: isActive ? jungleGreen : "transparent",
  })}
>
  {({ isActive }) => (
    <>
      {/* Active Indicator */}
      <span
        className={`absolute left-0 top-0 h-full w-1 rounded-r transition-opacity ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: jungleGreen }}
      />

      <Icon className="text-lg shrink-0" />

      {!collapsed && <span>{name}</span>}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="absolute left-full ml-3 px-3 py-1 text-xs rounded-md bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          {name}
        </span>
      )}
    </>
  )}
</NavLink>

            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t px-3 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: jungleGreen }}
          >
            A
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 leading-tight">
                <p className="text-sm font-semibold text-gray-800">
                  Admin User
                </p>
                <p className="text-xs text-gray-500">
                  admin@carsales.com
                </p>
              </div>

              <div className="relative">
                <FaBell className="text-gray-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;



