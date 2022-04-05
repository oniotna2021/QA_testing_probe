import { axiosInstanceReservation } from '../instance';

export const getAllSchedulesVenue = () => {
    return axiosInstanceReservation.get('scheduleVenue/all')
}

export const getScheduleVenueById = (id) => {
    return axiosInstanceReservation.get(`scheduleVenue/id/${id}`)
}

export const getLastScheduleVenue = () => {
    return axiosInstanceReservation.get(`scheduleVenue/last`)
}

export const postScheduleVenue= (data) => {
    return axiosInstanceReservation.post(`scheduleVenue`, data)
}

export const postAllShedulesVenue= (data) => {
    return axiosInstanceReservation.post(`scheduleVenue/a-lot`, data)
}

export const putUpdateSheduleVenueById = (data, idVenue) => {
    return axiosInstanceReservation.put(`scheduleVenue/update/${idVenue}`, data)
}

export const deleteScheduleVenue = (id) => {
    return axiosInstanceReservation.delete(`scheduleVenue/id/${id}`)
}