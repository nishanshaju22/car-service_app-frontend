import api from './axios';

export const carIssuesApi = {
    getCarRatings: async (carId) => {
        const response = await api.get(`car/car-ratings/${carId}`);
        return response.data;
    },

    getCarRecalls: async (carId) => {
        const response = await api.get(`car/car-recalls/${carId}`);
        return response.data;
    },

    getCarComplaints: async (carId) => {
        const response = await api.get(`car/car-complaints/${carId}`);
        return response.data;
    },
};