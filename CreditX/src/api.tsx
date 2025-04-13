import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// Create main API instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// You might want to add a separate instance for the analysis API
export const analysisApi = axios.create({
  baseURL: import.meta.env.VITE_ANALYSIS_API_URL || 'http://localhost:8002',
  headers: {
    'Content-Type': 'application/json',
  },
});