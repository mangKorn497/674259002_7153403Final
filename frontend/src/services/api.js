import axios from "axios";

// อ่าน URL จาก Environment Variables ถ้าไม่มีให้ใช้ localhost:5000/api
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const eventService = {
  // 1. อ่านรายการ ค้นหา และกรอง GET /api/events
  getAll: async (search = "", category = "") => {
    const params = {};
    if (search && search.trim() !== "") params.search = search.trim();
    if (category && category.trim() !== "") params.category = category.trim();

    const response = await apiClient.get("/events", { params });
    return response.data;
  },

  // 2. อ่านรายละเอียดหนึ่งรายการ GET /api/events/:id
  getById: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  // 3. เพิ่มรายการใหม่ POST /api/events
  create: async (eventData) => {
    const response = await apiClient.post("/events", eventData);
    return response.data;
  },

  // 4. แก้ไขรายการ PUT /api/events/:id
  update: async (id, eventData) => {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  },

  // 5. ลบรายการ DELETE /api/events/:id
  delete: async (id) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },
};

export default eventService;
