import React, { useState } from "react";
import {
  Mail,
  Lock,
  Car,
  CheckCircle,
  Eye,
  EyeOff,
  Phone,
  Sparkles,
  Award,
  Heart,
  History,
  Bell,
  Shield,
  Zap,
  TrendingUp,
  Target,
  Calculator,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { loginUser, createUser } from "../utils/api";
// import { useAuth } from "../context/authcontext";
import { useAuth } from "../context/AuthContext";

const AuthForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" && !isLogin) {
      const rawUsername = value.split("@")[0];
      const username =
        rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);
      setFormData({ ...formData, email: value, username });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const userData = await loginUser({
          username: formData.username,
          password: formData.password,
        });
        const role = userData.is_superuser
          ? "admin"
          : userData.role?.toLowerCase();
        // localStorage.setItem("role", role);
        // localStorage.setItem("authToken", userData.token);
        // localStorage.setItem("userName", userData.username);
        // localStorage.setItem("userEmail", userData.email);
        // localStorage.setItem("userPhone", userData.phone_number);
        sessionStorage.setItem("role", role);
      sessionStorage.setItem("authToken", userData.token);
      sessionStorage.setItem("userName", userData.username);
      sessionStorage.setItem("userEmail", userData.email);
      sessionStorage.setItem("userPhone", userData.phone_number);
        login(userData);
        showToast(`Welcome ${userData.username}!`);
        setLoading(false);
        setTimeout(
          () =>
            navigate(
              role === "admin" ? "/admin/dashboard" : "/buyer/dashboard",
            ),
          1500,
        );
      } else {
        await createUser({
          username: formData.username,
          email: formData.email,
          phone_number: formData.phone_number,
          password: formData.password,
        });
        showToast("Account created successfully! Please login.");
        setLoading(false);
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone_number: "",
        });
        setTimeout(() => setIsLogin(true), 1500);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong.";
      showToast(errorMessage, "error");
    }
  };

  const handleSocialLogin = (provider) => {
    showToast(`Sign in with ${provider} coming soon!`, "info");
  };

  const benefits = [
    {
      icon: <Sparkles />,
      title: "Personalized Dashboard",
      desc: "Smart insights, activity tracking, and recommendations tailored just for you",
    },
    {
      icon: <Car />,
      title: "Advanced Inventory Features",
      desc: "Save searches, compare cars, get price alerts and exclusive listings",
    },
    {
      icon: <History />,
      title: "Smart History Tracking",
      desc: "View your search patterns, test drives, and inquiries all in one place",
    },
    {
      icon: <Heart />,
      title: "Favorites & Wishlists",
      desc: "Save your favorite cars and get to create wishlists",
    },
    {
      icon: <Bell />,
      title: "Guides and Tips",
      desc: "Get Tips and guides of purchasing a car before committing",
    },
     {
      icon: <Calculator />,
      title: "Finance Calculator",
      desc: "Get an accurate finance calculator to help you plan for your purchases",
    },
  ];

  return (
    <>
      <Navbar />
      {toast && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-12 items-stretch">
          {/* LEFT - Benefits Panel */}
          <div className="lg:w-1/2 hidden lg:flex flex-col gap-6 sticky top-20">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-10 rounded-3xl shadow-2xl text-white flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Why Join DuoDrive?</h2>
                  <p className="text-emerald-100 mt-1">
                    Unlock a premium car buying experience
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <div className="bg-white/20 p-3 rounded-xl">{b.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{b.title}</h3>
                      <p className="text-emerald-100 text-sm">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 bg-white/20 rounded-2xl backdrop-blur-md border border-white/25 flex items-center gap-3">
                <Shield className="w-6 h-6 text-emerald-200" />
                <p className="text-sm text-emerald-100 font-medium">
                  100% Secure & Verified - your data and purchases are protected
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT - Auth Form */}
          <div className="lg:w-1/2 max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl mb-4 shadow-xl">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                {isLogin ? "Unlock Your Drive" : "Start Your Journey"}
              </h1>
              <p className="text-gray-600 text-base">
                {isLogin
                  ? "Sign in now to access your garage, favourites, and exclusive deals."
                  : "Create your account today and step into the driver’s seat of premium features."}
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-emerald-700">
                        Create Your Account
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your username will be generated automatically from your
                      email.
                    </p>
                  </div>
                )}

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder={
                        isLogin ? "Enter your username" : "Autogenerated"
                      }
                      required
                      readOnly={!isLogin}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {!isLogin && (
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
                        placeholder="your.email@example.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                    {formData.email && (
                      <p className="mt-2 text-xs text-emerald-600 font-medium">
                        Your username:{" "}
                        <span className="font-bold">{formData.username}</span>
                      </p>
                    )}
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="+254 700 123456"
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-6 group"
                >
                  {loading
                    ? isLogin
                      ? "Authenticating..."
                      : "Creating account..."
                    : isLogin
                      ? "Enter Your Garage"
                      : "Claim Your Seat"}
                </button>
              </form>

              {/* Switch between login/signup */}
              <div className="mt-6 text-center text-gray-600">
                <span>
                  {isLogin ? "New here?" : "Already have an account?"}
                </span>{" "}
                <button
                  onClick={() => {
                    if (!loading) {
                      setIsLogin(!isLogin);
                      setFormData({
                        username: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        phone_number: "",
                      });
                    }
                  }}
                  disabled={loading}
                  className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline disabled:opacity-50"
                >
                  {isLogin ? "Create Account" : "Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthForm;
