import React, { useState } from "react";
// import { FaCar, FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Mail, Lock, User, Car, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

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
    confirmPassword: "",
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

    if (
      formData.email === "kelvin@admin.com" &&
      formData.password === "123456"
    ) {
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
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 transition-all duration-300 z-50 ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{toast.message}</span>
          </div>
        )}

        {/* Auth Card */}
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg">
              <Car className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome Back" : "Join the Drive"}
            </h1>
            <p className="text-gray-500">
              {isLogin
                ? "Manage your premium car sales"
                : "Create your dealer account"}
            </p>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-lg">
              <p className="text-sm text-emerald-800">
                <span className="font-semibold">Demo:</span> kelvin@admin.com /
                123456
              </p>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-8">
            <div className="space-y-5">
              {/* Name Field */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <div className="relative h-10 w-full overflow-hidden">
                    {/* Car + text */}
                    <div className="absolute top-1/2 left-0 flex items-center animate-driveOnce">
                      {/* Loading text */}
                      <div className="mr-3 flex flex-col text-left leading-none">
                        <span className="text-xs font-semibold text-white opacity-80">
                          loading
                        </span>
                        <span className="text-xs font-semibold text-white opacity-50">
                          loading
                        </span>
                      </div>

                      {/* Car */}
                      <Car className="w-8 h-8 text-white" />
                    </div>

                    {/* LOCAL animation styles */}
                    <style>{`
      @keyframes driveOnce {
        0% {
          opacity: 0;
          transform: translateX(-40%) translateY(-50%) scale(0.95);
        }
        15% {
          opacity: 1;
          transform: translateX(-10%) translateY(-50%) scale(1);
        }
        100% {
          opacity: 1;
          transform: translateX(340%) translateY(-50%) scale(1);
        }
      }

      .animate-driveOnce {
        animation: driveOnce 2.2s ease-in forwards;
      }
    `}</style>
                  </div>
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center text-gray-600">
              <span>{isLogin ? "New Here?" : "Already have an account?"}</span>{" "}
              <button
                onClick={() => !loading && setIsLogin(!isLogin)}
                disabled={loading}
                className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline disabled:opacity-50"
              >
                {isLogin ? "Create account" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
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
