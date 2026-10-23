import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Menambahkan Authorization Bearer Token jika tersedia
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jobhunt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Format respons & tangani error dengan ramah
api.interceptors.response.use(
  (response) => {
    // Backend JobHunt selalu mengembalikan objek { message, data, errors }
    return response.data;
  },
  (error) => {
    const responseData = error.response?.data;
    const status = error.response?.status;

    let friendlyMessage = "Terjadi kesalahan jaringan. Periksa koneksi internet Anda.";

    if (responseData?.message) {
      friendlyMessage = responseData.message;
    } else if (status === 404) {
      friendlyMessage = "Data yang diminta tidak ditemukan.";
    } else if (status === 403) {
      friendlyMessage = "Anda tidak memiliki izin untuk melakukan tindakan ini.";
    } else if (status === 401) {
      friendlyMessage = "Sesi telah berakhir atau Anda belum login.";
      // Hapus token jika ditolak oleh backend
      if (localStorage.getItem("jobhunt_token")) {
        localStorage.removeItem("jobhunt_token");
        localStorage.removeItem("jobhunt_user");
      }
    } else if (status >= 500) {
      friendlyMessage = "Terjadi kendala pada server. Silakan coba beberapa saat lagi.";
    }

    const customError = new Error(friendlyMessage);
    customError.status = status;
    customError.rawErrors = responseData?.errors || null;
    customError.data = responseData?.data || null;

    // Jika terdapat array validasi dari express-validator
    if (Array.isArray(responseData?.errors)) {
      const fieldErrors = {};
      responseData.errors.forEach((err) => {
        if (err.path && !fieldErrors[err.path]) {
          fieldErrors[err.path] = err.msg;
        }
      });
      customError.fieldErrors = fieldErrors;
    }

    return Promise.reject(customError);
  },
);

export default api;
