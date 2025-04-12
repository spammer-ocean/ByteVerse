import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

export const api = axios.create({
  baseURL: "http://127.0.0.1:8001",
});