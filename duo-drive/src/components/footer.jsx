// import Tooltip from "./socials";

// const Footer = () => {
//   return (
//     <footer className="bg-gradient-to-b from-black to-gray-900 text-white pt-20 pb-8">
//       <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-4">

//         {/* BRAND */}
//         <div>
//           <h3 className="text-3xl font-extrabold mb-4 tracking-tight">
//             Duo<span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent">
//               Drive
//             </span>{" "}
//             Kenya
//           </h3>
//           <p className="text-gray-400 leading-relaxed">
//             Duo Drive Kenya is a premium car dealership offering carefully
//             sourced vehicles, transparent pricing, and flexible financing
//             solutions across Kenya.
//           </p>
//         </div>

//         {/* LINKS */}
//         <div>
//           <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm text-gray-300">
//             Quick Links
//           </h4>
//           <ul className="space-y-3 text-gray-400">
//   <li>
//     <a href="/inventory" className="hover:text-[#1f7a63] transition cursor-pointer">
//       Inventory
//     </a>
//   </li>
//   <li>
//     <a href="/financing" className="hover:text-[#1f7a63] transition cursor-pointer">
//       Financing
//     </a>
//   </li>
//   <li>
//     <a href="/about" className="hover:text-[#1f7a63] transition cursor-pointer">
//       About us
//     </a>
//   </li>
//   <li>
//     <a href="/contact" className="hover:text-[#1f7a63] transition cursor-pointer">
//       Contact
//     </a>
//   </li>
// </ul>

//         </div>

//         {/* CONTACT */}
//         <div>
//           <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm text-gray-300">
//             Contact
//           </h4>
//           <ul className="space-y-3 text-gray-400">
//             <li>📍 Nairobi, Kenya</li>
//             <li>📞 +254 706 193 959</li>
//             <li>✉ duodrivekenya@gmail.com</li>
//           </ul> <br /><br />
//            <Tooltip/>
//         </div>

//         {/* CTA */}
//         <div>
//           <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm text-gray-300">
//             Let’s Talk
//           </h4>
//           <p className="text-gray-400 mb-4">
//             Ready to own your next car? Speak to our team today.
//           </p>
//           <a href="/contact" className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
//           Book Consultation
//           </a>
//           {/* <button className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
//             Book Consultation
//           </button> */}
//         </div>
//       </div>

//       {/* DIVIDER */}
//       <div className="mt-16 border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
//         © {new Date().getFullYear()} Duo Drive Kenya. All Rights Reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import Tooltip from "./socials";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCar, FaCreditCard, FaUserFriends, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";



const Footer = () => {
  // WhatsApp configuration
  const phoneNumber = "254706193959";
  const message = "Hello, I wanted to inquire about your carsales services";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

   // Check localStorage role or user.role
  const { user } = useAuth();
  const role = localStorage.getItem("role") || user?.role?.toLowerCase();
  const isBuyerLoggedIn = role === "buyer";


   // Build links conditionally
  const links = [
    { icon: <FaCar />, label: "Browse Inventory", href: isBuyerLoggedIn ? "/buyer/inventory" : "/inventory" },
    // Financing only if logged in
    ...(isBuyerLoggedIn
      ? [{ icon: <FaCreditCard />, label: "Financing Options", href: "/buyer/financing" }]
      : []),
    // About Us only if not logged in
    ...(!isBuyerLoggedIn
      ? [{ icon: <FaUserFriends />, label: "About Us", href: "/about" }]
      : []),
    { icon: <FaEnvelope />, label: "Contact Us", href: isBuyerLoggedIn ? "/buyer/contact" : "/contact" },
  ];


  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-[#1f7a63] to-[#2fa88a] rounded-lg flex items-center justify-center">
                <FaCar className="text-white text-xl" />
              </div> */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Duo<span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent">
                    Drive
                  </span>{" "}
                  Kenya
                </h2>
                <p className="text-sm text-gray-400 mt-1">Find it, Drive it, Love it</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-xl">
              Your trusted partner in premium automotive solutions. We specialize in carefully sourced vehicles, 
              transparent pricing, and flexible financing options across Kenya. Experience excellence on wheels.
            </p>
            
            {/* WhatsApp CTA */}
            <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FaWhatsapp className="text-green-400 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold">Instant Support</h4>
                  <p className="text-sm text-gray-400">Chat with us now</p>
                </div>
              </div>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] w-full justify-center"
              >
                <FaWhatsapp className="text-lg" />
                Message on WhatsApp
                <FaArrowRight className="text-sm ml-2" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
         <div>
  <h4 className="text-lg font-bold mb-6 pb-2 border-b border-white/10 inline-block">
    Quick Links
  </h4>
   <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="flex items-center gap-3 text-gray-300 hover:text-[#2fa88a] transition-all duration-300 hover:translate-x-1 group"
          >
            <span className="text-[#1f7a63] group-hover:scale-110 transition-transform">
              {link.icon}
            </span>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
</div>


          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 pb-2 border-b border-white/10 inline-block">
              Contact Info
            </h4>
            <ul className="space-y-4">
              {[
                { icon: <FaMapMarkerAlt />, text: "Nairobi, Kenya", },
                { icon: <FaPhoneAlt />, text: "+254 706 193 959", detail: "Mon-Sat: 8AM - 6PM" },
                { icon: <FaEnvelope />, text: "duodrivekenya@gmail.com", detail: "Response within 24 hours" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg mt-1">
                    <span className="text-[#2fa88a]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium">{item.text}</p>
                    <p className="text-sm text-gray-400">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Newsletter */}
            {/* <div className="mt-8">
              <h5 className="font-semibold mb-3 text-gray-300">Stay Updated</h5>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#2fa88a] transition"
                />
                <button className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} Duo Drive Kenya. All Rights Reserved.</p>
            {/* <p className="mt-1 text-xs">Registered Car Dealer • VAT No: KE-XXXX-XXXX</p> */}
          </div>
          
          {/* Social Media */}
          <div className="flex items-center gap-6">
            {/* <Tooltip /> */}
            <div className="flex gap-4">
              {[ "FAQ"].map((item) => (
                <a 
                  key={item} 
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-white text-sm transition hover:underline"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-gray-400 text-sm">
            We accept all major payment methods • Flexible financing available • Certified vehicles only
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;