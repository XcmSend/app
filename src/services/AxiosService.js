// axiosService.js
import axios from 'axios';

const threadbagInstance = axios.create({
    baseURL: import.meta.env.VITE_THREADBAG_BASE_URL,
    withCredentials: true, 
});

export default threadbagInstance;