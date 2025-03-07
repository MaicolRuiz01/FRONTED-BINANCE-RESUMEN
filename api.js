import axios from 'axios';

const API_BASE_URL = 'https://api.binance.com';

const publicApiCall = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
}

export const getServerTime = () => publicApiCall('/api/v3/time');
