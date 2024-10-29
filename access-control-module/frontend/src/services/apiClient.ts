import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to refresh token
let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
let failedQueue: Array<{ resolve: Function, reject: Function }> = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      // Resolve with the new token
      prom.resolve(token); 
    } else {
      // Reject if the refresh failed
      prom.reject(error); 
    }
  });

  failedQueue = []; // Clear the queue after processing
}

// Request interceptor to add token to headers
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
  
// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Check if the request is for the login endpoint
    const isLoginEndpoint = originalRequest.url.includes('/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isLoginEndpoint) {
      if (isRefreshing) {
        // Push the original request to the failed queue
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            // Use the new token for the original request
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');
        const { data } = await axios.post('http://localhost:3000/api/auth/refresh-token', { refreshToken, userId });

        // Store new tokens in local storage
        localStorage.setItem('accessToken', data.tokens.accessToken); // Update the accessToken
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('userId', data.userId);

        const newToken = data.tokens.accessToken; // New token to be used

        // Process the queue with the new token
        processQueue(null, newToken);

        // Set the new token for the original request
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return apiClient(originalRequest);
      } catch (err) {
        // Process the queue with the error
        processQueue(err, null);

        // Remove all tokens from local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');

        // Redirect to the login page
        window.location.href = '/login';

        return Promise.reject(err);
      } finally {
        isRefreshing = false; // Reset the refreshing state
      }
    }

    return Promise.reject(error); // Reject any other errors
  }
);
  
export default apiClient;
