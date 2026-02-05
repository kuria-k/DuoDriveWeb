import React, { useState } from "react";
import { Mail, Lock, Car, CheckCircle, Eye, EyeOff, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { loginUser, createUser } from "../utils/api";
import { useAuth } from "../context/authcontext";

const AuthForm = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
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

    // If email changes during signup, auto-generate username
    if (name === "email" && !isLogin) {
      const rawUsername = value.split("@")[0];
      // Capitalize the first letter
      const username =
        rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1);
      setFormData({ ...formData, email: value, username: username });
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
        const credentials = {
          username: formData.username,
          password: formData.password,
        };

        const userData = await loginUser(credentials);

        // Normalize role and store immediately
        const normalizedRole = userData.is_superuser
          ? "admin"
          : userData.role?.toLowerCase();
        localStorage.setItem("role", normalizedRole);
        localStorage.setItem("authToken", userData.token);
        localStorage.setItem("userName", userData.username);

        // Update context
        login(userData);

        // Show welcome toast
        showToast(`Engine started… Welcome ${userData.username}!`);
        setLoading(false);

        //  Delay navigation so toast is visible
        setTimeout(() => {
          if (normalizedRole === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/buyer/dashboard", { replace: true });
          }
        }, 2000); // 2 seconds delay
      } else {
        // Registration flow...
        await createUser({
          username: formData.username,
          email: formData.email,
          phone_number: formData.phone_number,
          password: formData.password,
        });

        showToast("Account created successfully! Please login to continue.");
        setLoading(false);

        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone_number: "",
        });

        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      if (isLogin) {
        if (errorMessage.toLowerCase().includes("not found")) {
          showToast("User not found. Please register first.", "error");
        } else if (errorMessage.toLowerCase().includes("password")) {
          showToast("Incorrect password. Please try again.", "error");
        } else {
          showToast(errorMessage, "error");
        }
      } else {
        if (errorMessage.toLowerCase().includes("already exists")) {
          showToast(
            "This email is already registered. Please login instead.",
            "error",
          );
        } else {
          showToast(errorMessage, "error");
        }
      }
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
                ? "Login to access your account"
                : "Create your account to get started"}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <h2 className="text-lg font-semibold text-emerald-700 mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-sm text-gray-600">
                    Please enter your email and password to sign up. Your
                    username will be automatically generated from your email and
                    shown below — no need to edit it.
                  </p>
                </div>
              )}

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
                      isLogin ? "Username" : "Username is autogenerated"
                    }
                    required
                    readOnly={!isLogin}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email Field - Only for SIGNUP */}
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
                    <p className="mt-2 text-xs text-gray-500">
                      Your username will be:{" "}
                      <span className="font-semibold text-emerald-600">
                        {formData.username}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Phone Field - Only for SIGNUP */}
              {!isLogin && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    {/* You can use a phone icon from lucide-react or react-icons */}
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
                  {formData.phone_number && (
                    <p className="mt-2 text-xs text-gray-500">
                      We’ll use this number for account recovery and
                      notifications.
                    </p>
                  )}
                </div>
              )}

              {/* Password Field */}
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
                    placeholder="Password"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field - Only for SIGNUP */}
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
                      placeholder="Confirm Password"
                      required
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <div className="relative h-10 w-full overflow-hidden">
                    <div className="absolute top-1/2 left-0 flex items-center animate-driveOnce">
                      <div className="mr-3 flex flex-col text-left leading-none">
                        <span className="text-xs font-semibold text-white opacity-80">
                          {isLogin ? "logging in" : "creating account"}
                        </span>
                        <span className="text-xs font-semibold text-white opacity-50">
                          {isLogin ? "logging in" : "creating account"}
                        </span>
                      </div>
                      <Car className="w-8 h-8 text-white" />
                    </div>
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
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-6 text-center text-gray-600">
              <span>{isLogin ? "New Here?" : "Already have an account?"}</span>{" "}
              <button
                onClick={() => {
                  if (!loading) {
                    setIsLogin(!isLogin);
                    setFormData({
                      username: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                    });
                  }
                }}
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

export default AuthForm;
