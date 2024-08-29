import axios from "axios";

const apiRequest = axios.create({
    // baseURL: "https://mern-realestate-9eew.onrender.com/api",
    baseURL: "https://homequest-ucjd.onrender.com/api",
    withCredentials: true
})

export default apiRequest;
