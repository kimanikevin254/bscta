import apiClient from "./apiClient";

export const createProject = async (projectDetails: { name: string, description: string, startDate: string, endDate?: string }) => {
    const { data } =   await apiClient.post('/project', {
        ...projectDetails,
        startDate: new Date(projectDetails.startDate),
        endDate: projectDetails.endDate ? new Date(projectDetails.endDate) : undefined
    })
    return data;
}

export const fetchProjects = async () => {
    try {
        const { data } = await apiClient.get('/project')
        return data;
    } catch (error) {
        console.log('Unable to fetch projects', error);
        throw error;
    }
}

export const fetchProject = async (projectId: string) => {
    try {
        const { data } = await apiClient.get(`/project/${projectId}`)
        return data;
    } catch (error) {
        console.log('Unable to fetch project', error);
        throw error;
    }
}

export const deleteProject = async (projectId: string) => {
    try {
        return await apiClient.delete(`/project/${projectId}`)
    } catch (error) {
        console.log('Unable to fetch project', error);
        throw error;
    }
}

export const fetchAssignedUsers = async (projectId: string) => {
    try {
        const { data } = await apiClient.get(`/project/${projectId}/assigned`);

        return data
    } catch (error) {
        throw error
    }
}

export const unassignUser = async (projectId: string, userId: string) => {
    try {
        const { data } = await apiClient.post(`/project/${projectId}/unassign-user`, { userId })
        return data
    } catch (error) {
        throw error
    }
}

export const assignUser = async (projectId: string, email: string) => {
    try {
        const { data } = await apiClient.post(`/project/${projectId}/assign-user`, { email })
        return data
    } catch (error) {
        throw error
    }
}
