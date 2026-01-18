import React, { useState } from "react";
import { FaCar, FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const jungleGreen = "#2fa88a";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (formData.email === "kelvin@admin.com" && formData.password === "123456") {
      setLoading(true);
      showToast("Engine started… Driving to Admin Dashboard");

      setTimeout(() => {
        localStorage.setItem("role", "admin");
        navigate("/admin/dashboard");
        setLoading(false);
      }, 3000);
    } else {
      showToast("Invalid credentials", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b2f2a_0%,_#0e1c18_40%,_#020807_100%)] p-4">
      {/* Inline animation */}
      <style>{`
        @keyframes carMove {
          0% { left: -30px; }
          100% { left: calc(100% + 30px); }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white font-semibold shadow-2xl z-50
          ${toast.type === "error" ? "bg-red-600" : "bg-gradient-to-r from-emerald-500 to-teal-600"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,.6)] p-8 text-white">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_40px_rgba(47,168,138,.7)]">
            <FaCar className="text-4xl" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-center mb-1">
          {isLogin ? "Welcome Back" : "Join the Drive"}
        </h1>
        <p className="text-center text-white/70 mb-6">
          {isLogin
            ? "Manage your premium car sales"
            : "Create your dealer account"}
        </p>

        {isLogin && (
          <div className="mb-6 text-xs text-center bg-white/10 py-2 rounded-lg">
            Demo: <strong>kelvin@admin.com / 123456</strong>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              icon={<FaUser />}
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          <Input
            icon={<FaEnvelope />}
            placeholder="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            icon={<FaLock />}
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          {!isLogin && (
            <Input
              icon={<FaLock />}
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          {/* Button */}
          <button
            disabled={loading}
            className="relative w-full h-14 rounded-2xl font-bold text-lg overflow-hidden
              bg-gradient-to-r from-emerald-500 to-teal-600
              shadow-[0_15px_40px_rgba(47,168,138,.5)]
              hover:brightness-110 transition disabled:opacity-80"
          >
            {!loading ? (
              isLogin ? "Login" : "Create Account"
            ) : (
              <div className="relative w-full h-full">
                <FaCar
                  className="absolute top-1/2 -translate-y-1/2 text-2xl text-white"
                  style={{ animation: "carMove 1.1s linear infinite" }}
                />
              </div>
            )}
          </button>
        </form>

        {/* Switch */}
        <p className="mt-6 text-center text-sm text-white/80">
          {isLogin ? "New dealer?" : "Already have an account?"}{" "}
          <span
            onClick={() => !loading && setIsLogin(!isLogin)}
            className="text-emerald-400 font-bold cursor-pointer hover:underline"
          >
            {isLogin ? "Create account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

/* Reusable Input */
const Input = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
      {icon}
    </span>
    <input
      {...props}
      required
      className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/15 border border-white/10
      placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);

export default AuthForm;
