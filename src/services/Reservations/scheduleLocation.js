import { axiosInstanceReservation } from '../instance';

export const postAddScheduleLocation = (data) => {
    return axiosInstanceReservation.post('scheduleLocation', data)
}

export const postAddMultipleSchedulesLocation = (data) => {
    return axiosInstanceReservation.post('scheduleLocation/schedules', data)
}

export const putScheduleLocation = (data, id) => {
    return axiosInstanceReservation.put(`scheduleLocation/uuid/${id}`, data)
}
