import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Calculate property price
export async function calculateProperty(data) {
    const response = await API.post("/properties/calculate", data);
    return response.data;
}

// Create new property listing
export async function createProperty(data) {
    const response = await API.post("/properties", data);
    return response.data;
}

// Get all properties with optional filters
export async function getProperties(filters = {}) {
    const params = new URLSearchParams();

    if (filters.city) params.append("city", filters.city);
    if (filters.propertyType) params.append("propertyType", filters.propertyType);
    if (filters.bedrooms) params.append("bedrooms", filters.bedrooms);
    if (filters.sort) params.append("sort", filters.sort);

    const response = await API.get(`/properties?${params.toString()}`);
    return response.data;
}

// Delete a property
export async function deleteProperty(id) {
    const response = await API.delete(`/properties/${id}`);
    return response.data;
}

// Get analytics data for dashboard (filtered by type: Buy or Rent)
export async function getAnalytics(type = "") {
    const query = type ? `?type=${type}` : "";
    const response = await API.get(`/properties/analytics${query}`);
    return response.data;
}
