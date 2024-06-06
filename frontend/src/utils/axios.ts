// utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;