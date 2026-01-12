import { Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Inventory from "../pages/inventory";
import CarDetail from "../pages/cardetails";
import About from "../pages/about";
import Financing from "../pages/financing";
import Blog from "../pages/blog";
import Contact from "../pages/contact";
import FAQ from "../pages/faq";

const AppRoutes = () => {
  return (
    <Routes>
      {/* MAIN PAGES */}
      <Route path="/" element={<Home />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/about" element={<About />} />
      <Route path="/financing" element={<Financing />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ/>}/>

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
