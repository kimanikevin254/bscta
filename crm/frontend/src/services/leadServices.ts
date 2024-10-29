/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./apiClient";

export const createLead = async (values: { name: string; email: string; phone: string; companyName: string; }) => {
    const { data } = await apiClient.post('/lead', values);

    return data;
}

export const getLeads = async () => {
    const { data } = await apiClient.get('/lead');

    return data;
}

export const updateLead = async (leadId: string, values: { name: string; email: string; phone: string; companyName: string; }) => {
    const { data } = await apiClient.patch(`/lead/${leadId}`, { ...values });

    return data;
}

export const deleteLead = async (leadId: string) => {
    return await apiClient.delete(`/lead/${leadId}`);
}

export const converToCustomer = async (leadId: string) => {
    const { data } = await apiClient.post('/customer', { leadId })

    return data
}

export const addInteraction = async (leadId: any, values: any) => {
    const { data } = await apiClient.post('/interaction', { ...values, leadId })
    return data
}

export const searchLeads = async (value: any) => {
    const { data } = await apiClient.post('/search/leads', { ...value })
    return data
}