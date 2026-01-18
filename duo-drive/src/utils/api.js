// src/api.js
import axios from "axios";

// Base URL of your Django backend
const API_BASE_URL = "http://localhost:8000/api";

// Create a reusable axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Contact form submission
export const submitContactForm = async (formData) => {
  try {
    const response = await api.post("/contact/", formData);
    return response.data; // returns { message: "Contact saved successfully!" }
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw error.response.data;
    } else {
      // Network or other error
      throw { error: "Network error. Please try again." };
    }
  }
};
