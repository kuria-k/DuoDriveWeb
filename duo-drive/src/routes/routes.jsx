import { Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Login from "../pages/login";
import Inventory from "../pages/inventory";
import CarDetail from "../pages/cardetails";
import About from "../pages/about";
import Financing from "../pages/financing";
import Blog from "../pages/blog";
import Contact from "../pages/contact";
import FAQ from "../pages/faq";
import AdminLayout from "../layouts/adminlayout";
import Dashboard from "../pages/admin/dashboard";
import Inventori from "../pages/admin/inventori";
import Sales from "../pages/admin/sales";
import Users from "../pages/admin/users";


const AppRoutes = () => {
  return (
    <Routes>
      {/* MAIN PAGES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/about" element={<About />} />
      <Route path="/financing" element={<Financing />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventori />} />
        <Route path="users" element={<Users />} />
        <Route path="sales" element={<Sales />} />
      </Route>

      {/* DYNAMIC CAR PAGE */}
      <Route path="/car/:id" element={<CarDetail />} />

      {/* 404 FALLBACK */}
      <Route
        path="*"
        element={
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <h1>404</h1>
            <p>Page not found</p>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
