import { jwtDecode } from 'jwt-decode'

export const getUserPermissions = () => {
    try {
        const token = localStorage.getItem('accessToken') as string;
        const decoded: unknown = jwtDecode(token);
        // @ts-expect-error requires type def
        return decoded.role.permissions;
    } catch (error) {
        console.log('Failed to decode JWT', error);
        return []
    }
}

export const hasPermission = ({ resource, actions }: { resource: string; actions: string[] }): boolean => {
    const userPermissions = getUserPermissions();

    // Find the permissions for the specified resource
    const resourcePermissions = userPermissions.find((permission: { resource: string; }) => permission.resource === resource);

    // If the resource does not exist, return false
    if (!resourcePermissions) {
        return false;
    }

    // Check if all specified actions exist in the resource's actions
    return actions.every(action => resourcePermissions.actions.includes(action));
};

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

