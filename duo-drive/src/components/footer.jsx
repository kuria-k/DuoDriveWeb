import Tooltip from "./socials";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <h3 className="text-3xl font-extrabold mb-4 tracking-tight">
            Duo<span className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] bg-clip-text text-transparent">
              Drive
            </span>{" "}
            Kenya
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Duo Drive Kenya is a premium car dealership offering carefully
            sourced vehicles, transparent pricing, and flexible financing
            solutions across Kenya.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm text-gray-300">
            Quick Links
          </h4>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-[#1f7a63] transition cursor-pointer">
              Inventory
            </li>
            <li className="hover:text-[#1f7a63] transition cursor-pointer">
              Financing
            </li>
            <li className="hover:text-[#1f7a63] transition cursor-pointer">
              About Us
            </li>
            <li className="hover:text-[#1f7a63] transition cursor-pointer">
              Contact
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm text-gray-300">
            Contact
          </h4>
          <ul className="space-y-3 text-gray-400">
            <li>📍 Nairobi, Kenya</li>
            <li>📞 +254 7XX XXX XXX</li>
            <li>✉ info@duodrive.co.ke</li>
          </ul> <br /><br />
           <Tooltip/>
        </div>

        {/* CTA */}
        <div>
          <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm text-gray-300">
            Let’s Talk
          </h4>
          <p className="text-gray-400 mb-4">
            Ready to own your next car? Speak to our team today.
          </p>
          <button className="bg-gradient-to-r from-[#1f7a63] to-[#2fa88a] px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Book Consultation
          </button>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mt-16 border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Duo Drive Kenya. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

