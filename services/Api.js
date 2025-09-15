import axios from "axios";

// Create axios instance with base URL
const Api = axios.create({
  baseURL: `${process.env.BACKEND_URL}/api`, // points to your Express backend
    headers: {
    "Content-Type": "application/json",
  },
});

export default Api;