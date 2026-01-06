import api from './axios';

export const maintenanceApi = {
    getMaintenanceInfo: async (carId) => {
        const response = await api.get(`/maintenance/get-maintenance?carId=${carId}`);
        return response.data;
    },
};