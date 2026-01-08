import { useEffect } from 'react';
import { maintenanceApi } from '../api/maintainanseApi';

const useAutoCompleteScheduledMaintenance = (maintenance, selectedCarId) => {

    const parseScheduledDate = (dateString) => {
        if (!dateString) return null;

        const iso = dateString.replace(' ', 'T');
        return new Date(iso);
    };

    useEffect(() => {
        if (!selectedCarId) return;
        if (!Array.isArray(maintenance) || maintenance.length === 0) return;

        const now = new Date();

        maintenance.forEach(async (item) => {
            if (item.status === 'SCHEDULED' && item.scheduledDate) {
                const scheduledDate = parseScheduledDate(item.scheduledDate);

                if (!scheduledDate || isNaN(scheduledDate.getTime())) return;

                if (now >= scheduledDate) {
                    updateStatusOnDue(item, selectedCarId);
                }
            }
        });
    }, [maintenance, selectedCarId]);

    async function updateStatusOnDue(item, selectedCarId) {
        try {
            await maintenanceApi.updateStatus({
                carId: selectedCarId,
                servId: item.serviceId,
                mileage: item.scheduledMileage,
                status: 'COMPLETED',
            });
        } catch (error) {
            console.error('Auto-complete failed:', error);
        }
    }
};

export default useAutoCompleteScheduledMaintenance;
