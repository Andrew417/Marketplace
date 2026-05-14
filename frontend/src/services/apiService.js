const BASE_URL = 'http://localhost:8080';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const body = await response.json();
  // Spring Boot always returns { status, message, data }
  if (!response.ok || body.status >= 400) {
    throw new Error(body.message || 'Request failed');
  }
  return body;
};

const apiService = {
  post: async (path, payload, requiresAuth = false) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(requiresAuth ? getAuthHeader() : {}),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  get: async (path, requiresAuth = true) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(requiresAuth ? getAuthHeader() : {}),
      },
    });
    return handleResponse(response);
  },
};

export default apiService;