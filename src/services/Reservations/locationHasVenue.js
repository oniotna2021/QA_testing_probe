import { axiosInstanceReservation } from '../instance';

export const getLocationHasVenueById = (uuid) => {
    return axiosInstanceReservation.get(`location/${uuid}`)
}

export const getSchedulesByLocationVenue = (id) => {
    return axiosInstanceReservation.get(`scheduleLocation/locationVenue/${id}`)
}

export const postAddLocationHasVenue = (data) => {
    return axiosInstanceReservation.post('locationHasVenue', data)
}

export const postAddLocationHasVenueAndSchedules = (data) => {
    return axiosInstanceReservation.post('location/venue/schedules', data)
}

export const putLocationHasVenue = (data, id) => {
    return axiosInstanceReservation.put(`location/locationVenue/${id}/schedules`, data)
}

export const deleteLocationHasVenue = (uuid) => {
    return axiosInstanceReservation.delete(`location/uuid/${uuid}`)
}