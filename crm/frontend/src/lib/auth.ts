import { jwtDecode } from 'jwt-decode'

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return false; // No token found
    }

    try {
        // Decode the JWT
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decoded: any = jwtDecode(token);

        // Check if the token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decoded.exp && decoded.exp < currentTime) {
            console.log('JWT expired');
            return false; // Token is expired
        }

        return true; // Token is valid and not expired
    } catch (error) {
        console.log('Invalid JWT', error);
        return false; // Token is invalid
    }
};