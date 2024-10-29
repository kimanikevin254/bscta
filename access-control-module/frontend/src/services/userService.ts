import apiClient from "./apiClient"

// Fetch data on mount
export const fetchUserInfo = async () => {
    try {
        const { data } = await apiClient.get('/user/me');
        return data
    } catch (error) {
        console.log(error);
    }
}

export const inviteUser = async (userData: { name: string, email: string, phoneNumber: string, role: 'ADMIN' | 'PROJECT_MANAGER' | 'ENGINEER' }) => {
    try {
        const { data } = await apiClient.post('/auth/invite-user', userData)
        return data
    } catch (error) {
        throw error
    }
}

export const findAllUsers = async () => {
    try {
        const { data } = await apiClient.get('/user')
        return data
    } catch (error) {
        throw error
    }
}

export const deleteUser = async (userId: string) => {
    try {
        return await apiClient.delete(`/user/${userId}/delete`)
    } catch (error) {
        throw error
    }
}

export const updateUserRole = async (userId: string, role: 'ADMIN' | 'PROJECT_MANAGER' | 'ENGINEER') => {
    try {
        return await apiClient.post(`/user/${userId}/update-role`, { role })
    } catch (error) {
        throw error
    }
} 

export const logoutUser = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        return await apiClient.post(`/auth/logout`, { refreshToken })
    } catch (error) {
        throw error
    }
}

export const acceptInvite = async (acceptInviteData: { token: string, address: string, kraPinNumber: string, password: string }) => {
    try {
        const { data } = await apiClient.post('/auth/accept-invite', { ...acceptInviteData })
        return data
    } catch (error) {
        throw error
    }
}

export const forgetPassword = async (email: string) => {
    try {
        const { data } = await apiClient.post('/auth/forget-password', { email })
        return data
    } catch (error) {
        throw error
    }
}

export const resetPassword = async (resetPasswordData: { token: string, password: string }) => {
    try {
        const { data } = await apiClient.post('/auth/reset-password', { ...resetPasswordData })
        return data
    } catch (error) {
        throw error
    }
}