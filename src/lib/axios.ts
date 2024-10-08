import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Đọc URL từ biến môi trường
  timeout: 10000, // Thời gian chờ tối đa 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// Xử lý request trước khi gửi
axiosInstance.interceptors.request.use(
  (config) => {
    // Bạn có thể thêm token hoặc các cấu hình khác
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý response khi nhận được
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung như 401, 403, 500, ...
    if (error.response && error.response.status === 401) {
      // Ví dụ, điều hướng đến trang đăng nhập nếu hết hạn token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
