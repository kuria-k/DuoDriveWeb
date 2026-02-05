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
import Expenses from "../pages/admin/expenses";
import Leads from "../pages/admin/leads";
import BuyerDashboard from "../pages/buyer/dashboard2";
import Favourite from "../pages/buyer/favourites";
import History from "../pages/buyer/history";
import BuyerInventory from "../pages/buyer/inventoryy";
import Profile from "../pages/buyer/profile";
import Details from "../pages/buyer/details";
import BuyerLayout from "../layouts/buyerlayout";
import Tips from "../pages/buyer/tips&guides";
import BuyerContact from "../pages/buyer/contact";



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
      <Route path="/cardetails/:id" element={<CarDetail />} />
      <Route path="/faq" element={<FAQ />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventori />} />
        <Route path="users" element={<Users />} />
        <Route path="sales" element={<Sales />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="leads" element={<Leads />} />
      </Route>

      {/* Buyer routes */}
      <Route path="/buyer" element={<BuyerLayout />}>
        <Route path="dashboard" element={<BuyerDashboard />} />
        <Route path="inventory" element={<BuyerInventory />} />
        <Route path="favourites" element={<Favourite />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
        <Route path="details/:id" element={<Details />} />
        <Route path="tips" element={<Tips />} />
        <Route path="contact" element={<BuyerContact />} />
        
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
