import { axiosInstanceReservation } from '../instance';

export const getOptionalManagersSchedule = (data) => {
    return axiosInstanceReservation.post(`scheduleActivity/managersBySchedules`, data);
}

export const updateManagersSchedule = (data) => {
    return axiosInstanceReservation.put(`scheduleActivity/managersByDates`, data);
}

export const updateManagersScheduleQuotes = (data) => {
    return axiosInstanceReservation.post(`quotesByMedical/reAssignQuotes`, data);
}


