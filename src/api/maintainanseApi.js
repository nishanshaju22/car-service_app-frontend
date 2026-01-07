import api from './axios';

export const maintenanceApi = {
    getMaintenanceInfo: async (carId) => {
        const response = await api.get(`/maintenance/get-maintenance?carId=${carId}`);
        return response.data;
    },

    addToMaintenance: async (maintenanceData) => {
        const response = await api.post(`/maintenance/add`, maintenanceData);
        console.log(response)
        return response.data;
    },

    findServices: async (carId, currMileage) => {
        const response = await api.get(`/maintenance/find-services?id=${carId}&currMileage=${currMileage}`);
        return response.data;
    },

};