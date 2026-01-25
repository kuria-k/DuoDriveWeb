import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; 

// Create an axios instance for reuse
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
export const getContacts = () => {
  return api.get("/contacts/");
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
