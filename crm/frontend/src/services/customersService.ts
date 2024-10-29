/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./apiClient";

export const getCustomers = async () => {
    const { data } = await apiClient.get('/customer');

    return data;
}

export const updateCustomer = async (customerId: any, values: any) => {
    const { data } = await apiClient.patch(`/customer/${customerId}`, { ...values });

    return data;
}

export const deleteCustomer = async (customerId: string) => {
    return await apiClient.delete(`/customer/${customerId}`);
}

export const addInteraction = async (customerId: any, values: any) => {
    const { data } = await apiClient.post('/interaction', { ...values, customerId })
    return data
}

export const searchCustomers = async (value: any) => {
    const { data } = await apiClient.post('/search/customers', { ...value })
    return data
}