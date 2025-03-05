import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const registerUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/register`, credentials);
  return response.data;
};