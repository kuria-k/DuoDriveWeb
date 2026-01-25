import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle,
} from "lucide-react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import adimg from "../assets/ad image.jpg";
import { createContact } from "../utils/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    subject_type: "General",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await createContact(formData);
      console.log(res);
      setSubmitted(true);

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        subject_type: "General",
        message: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      setError(err.error || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["0706193959", "0799011954", "0719652216"],
      // link: "tel:+15551234567",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["duodrivekenya@gmail.com"],
      // link: "mailto:sales@carsales.com",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Nairobi, Kenya"],
      // link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Sat: 9AM - 8PM", "Sunday: 10AM - 6PM"],
      link: null,
    },
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook", color: "hover:bg-blue-600" },
    { icon: Twitter, name: "Twitter", color: "hover:bg-sky-500" },
    { icon: Instagram, name: "Instagram", color: "hover:bg-pink-600" },
    { icon: Linkedin, name: "LinkedIn", color: "hover:bg-blue-700" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-emerald-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <span className="text-emerald-400 font-semibold text-sm tracking-wider uppercase">
              Get In Touch
            </span>
            <h1 className="text-6xl md:text-7xl font-bold mt-4 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300">
              Have questions? We're here to help. Reach out to our team and
              we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.link || "#"}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                  <info.icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {info.title}
                </h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600">
                    {detail}
                  </p>
                ))}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-10">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Send Us a Message
                </h2>
                <p className="text-xl text-gray-600">
                  Fill out the form below and we'll respond within 24 hours
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-600 rounded-2xl p-6 mb-6">
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {submitted ? (
                <div className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-700">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="0712345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject_type"
                        value={formData.subject_type}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                      >
                        <option value="General">General Inquiry</option>
                        <option value="Vehicle">Vehicle Inquiry</option>
                        <option value="Test_drive">Test Drive Request</option>
                        <option value="Financing">Financing Question</option>
                        {/* <option>Service Request</option> */}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us how we can help you in regards to the subject you have selected..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : (
                      <Send size={20} />
                    )}
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* Featured Business Ad */}
              <div className="rounded-3xl shadow-2xl overflow-hidden bg-white">
                <div className="relative h-80">
                  <img
                    src={adimg}
                    alt="Ad"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Sponsored
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Duo Drive Kenya
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Import quality vehicles directly from Japan. <br />
                    Trusted, inspected, and delivered to your doorstep.
                  </p>
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-8 text-white shadow-2xl">
                <MessageCircle className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3">
                  Need Immediate Help?
                </h3>
                <p className="text-emerald-100 mb-6">
                  Chat with our team in real-time for instant answers to your
                  questions.
                </p>
                <button className="w-full py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300">
                  Start Live Chat
                </button>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Follow Us
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className={`w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center hover:text-white transition-all duration-300 ${social.color}`}
                    >
                      <social.icon size={28} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-20 bg-white text-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">Have Questions?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Check out our FAQ page for quick answers to common questions
          </p>
          <button className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-xl">
            View FAQ
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
