import apiClient from "./apiClient";

export const login = async (values: { email: string; password: string }) => {
    const { data } = await apiClient.post('/auth/login', values);
  
    // Store tokens and userId
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    localStorage.setItem('userId', data.userId);

    return data;
}

export const register = async (values: { name: string, email: string; password: string }) => {
    const { data } = await apiClient.post('/auth/signup', values);
  
    // Store tokens and userId
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    localStorage.setItem('userId', data.userId);

    return data;
}