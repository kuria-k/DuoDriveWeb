import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; 

// Create an axios instance for reuse
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to attach the token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    // Use "Token" prefix for DRF TokenAuthentication
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});



// Expenses API helpers
export const getExpenses = () => {
  return api.get(`/expenses/`);
};

export const getExpense = (id) => {
  return api.get(`/expenses/${id}/`);
};

export const createExpense = (expenseData) => {
  return api.post(`/expenses/`, expenseData);
};

export const updateExpense = (id, expenseData) => {
  return api.put(`/expenses/${id}/`, expenseData);
};

export const deleteExpense = (id) => {
  return api.delete(`/expenses/${id}/`);
};


// Contact API helpers
// export const getContacts = () => {
//   return api.get("/contacts/");
// };
export const getContacts = async () => {
  try {
    const response = await api.get("/contacts/");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch contacts:", err.response?.data || err);
    throw err;
  }
};

export const getContact = (id) => {
  return api.get(`/contacts/${id}/`);
};

export const createContact = (contactData) => {
  return api.post("/contacts/", contactData);
};

// export const updateContact = (id, contactData) => {
//   return api.put(`/contacts/${id}/`, contactData);
// };
export const updateContact = (id, contactData) => {
  return api.patch(`/contacts/${id}/`, contactData);
};


export const deleteContact = (id) => {
  return api.delete(`/contacts/${id}/`);
};

// Sales API helpers 

export const getSales = () => {
  return api.get("/sales/");  
};

export const getSale = (id) => {
  return api.get(`/sales/${id}/`);  
};

export const createSale = (saleData) => {
  return api.post("/sales/", saleData);  
};

export const updateSale = (id, saleData) => {
  return api.put(`/sales/${id}/`, saleData);  
};

export const patchSale = (id, saleData) => {
  return api.patch(`/sales/${id}/`, saleData);  
};

export const deleteSale = (id) => {
  return api.delete(`/sales/${id}/`);  
};




export const getCars = () => {
  return api.get("/cars/");
};

export const getCarById = (id) => {
  return api.get(`/cars/${id}/`);
};

export const createCar = async (data, imageFiles = []) => {
  const formData = new FormData();

  // Append all car fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  // Append images
  imageFiles.forEach((file) => {
    formData.append("images", file); // Must match request.FILES.getlist("images") in Django
  });

  try {
    const response = await api.post("/cars/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // The new car with images
  } catch (err) {
    console.error("Failed to create car:", err.response?.data || err);
    throw err;
  }
};

export const updateCar = (id, carData) => {
  return api.patch(`/cars/${id}/`, carData);
};

export const updateCarWithImages = async (
  carId,
  data,
  imageFiles = [],
  deletedImageIds = []
) => {
  const formData = new FormData();

  // Append updated fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  // Append new images
  imageFiles.forEach((file) => {
    formData.append("images", file); // Must match request.FILES.getlist("images")
  });

  // Append deleted image IDs
  deletedImageIds.forEach((id) => {
    formData.append("deleted_images", id); // Must match request.data.get("deleted_images") in Django
  });

  try {
    const response = await api.put(`/cars/${carId}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // Updated car with new images
  } catch (err) {
    console.error("Failed to update car:", err.response?.data || err);
    throw err;
  }
};




export const deleteCar = (id) => {
  return api.delete(`/cars/${id}/`);
};


// Create a new user account (e.g., buyer signup)
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users/register/", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone_number,
      name: userData.name,
    });
    return response.data; // { id, username, email, role }
  } catch (err) {
    console.error("Failed to create user:", err.response?.data || err);
    throw err;
  }
};


export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/users/login/", {
      username: credentials.username,
      password: credentials.password,
    });
    // Expected payload: { id, username, email, role, is_superuser }
    return response.data;
  } catch (err) {
    console.error("Login failed:", err.response?.data || err);
    throw err;
  }
};


// Fetch all users (admin only)
export const getUsers = async () => {
  try {
    const response = await api.get("/users/");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch users:", err.response?.data || err);
    throw err;
  }
};

// Fetch single user
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch user ${id}:`, err.response?.data || err);
    throw err;
  }
};

export const getMyProfile = async () => {
  const token = sessionStorage.getItem("authToken");
  const response = await api.get("/users/me/", {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};




// Send a message
export const sendMessage = async (data) => {
  try {
    const response = await api.post("/chat/messages/create/", data);
    return response.data;
  } catch (err) {
    console.error("Failed to send message:", err.response?.data || err);
    throw err;
  }
};

// Get all messages
export const getMessages = async () => {
  try {
    const response = await api.get("/chat/messages/");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch messages:", err.response?.data || err);
    throw err;
  }
};

// Get messages for a specific user
export const getMessagesByUser = async (userId) => {
  try {
    const response = await api.get(`/chat/messages/user/${userId}/`);
    return response.data;
  } catch (err) {
    console.error(`Failed to fetch messages for user ${userId}:`, err.response?.data || err);
    throw err;
  }
};


// Favourites API helpers
export const toggleFavourite = async (carId) => {
  const response = await api.post("/favourites/toggle/", { carId });
  return response.data;
};

export const getFavourites = async () => {
  const response = await api.get("/favourites/");
  return response.data.data;
};



// Fetch recent filter history (5 most recent for logged-in user)
export const getFilterHistory = async () => {
  try {
    const response = await api.get("/history/filters/");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch filter history:", err.response?.data || err);
    throw err;
  }
};

// Save a new filter history entry
export const createFilterHistory = async (filters) => {
  try {
    const response = await api.post("/history/filters/", { filters });
    return response.data;
  } catch (err) {
    console.error("Failed to save filter history:", err.response?.data || err);
    throw err;
  }
};

// Fetch a single filter history entry by ID
export const getFilterHistoryById = async (id) => {
  try {
    const response = await api.get(`/history/filters/${id}/`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch filter history by ID:", err.response?.data || err);
    throw err;
  }
};

// Update a filter history entry by ID
export const updateFilterHistory = async (id, filters) => {
  try {
    const response = await api.put(`/history/filters/${id}/`, { filters });
    return response.data;
  } catch (err) {
    console.error("Failed to update filter history:", err.response?.data || err);
    throw err;
  }
};

// Delete a filter history entry by ID
export const deleteFilterHistory = async (id) => {
  try {
    const response = await api.delete(`/history/filters/${id}/`);
    return response.data;
  } catch (err) {
    console.error("Failed to delete filter history:", err.response?.data || err);
    throw err;
  }
};

export const saveSearchToHistory = (filters) => {
  try {
    const username = sessionStorage.getItem("userName");
    if (!username) return;
    
    const userSearches = JSON.parse(sessionStorage.getItem(`userSearches_${username}`) || '[]');
    
    const newSearch = {
      id: Date.now(), // Simple ID based on timestamp
      filters,
      created_at: new Date().toISOString(),
      username
    };
    
    userSearches.unshift(newSearch); // Add to beginning
    const limitedSearches = userSearches.slice(0, 20); // Keep only 20 most recent
    
    sessionStorage.setItem(`userSearches_${username}`, JSON.stringify(limitedSearches));
    return newSearch;
  } catch (error) {
    console.error("Error saving search to sessionstorage:", error);
  }
};

export const getUserSearches = () => {
  try {
    const username = sessionStorage.getItem("userName");
    if (!username) return [];
    
    const userSearches = JSON.parse(sessionStorage.getItem(`userSearches_${username}`) || '[]');
    return userSearches;
  } catch (error) {
    console.error("Error getting user searches:", error);
    return [];
  }
};



