import api from './axios';

export const carApi = {
    addCar: async (carData) => {
        const response = await api.post('/car/add', carData);
        return response.data;
    },

    getCars: async () => {
        const response = await api.get('/car/details');
        return response.data;
    },

    getCarById: async (carId) => {
        const response = await api.get(`/car/details/${carId}`);
        return response.data;
    },

    deleteCar: async (carId) => {
        const response = await api.delete(`/car/delete/${carId}`);
        return response.data;
    },

    updateCar: async (carId, carData) => {
        const response = await api.put(`/car/update/${carId}`, carData);
        return response.data;
    },
};