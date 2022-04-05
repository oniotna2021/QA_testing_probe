import { axiosInstanceReservation } from '../instance';

export const getShiftsVenuePag = () => {
    return axiosInstanceReservation.get('shiftsVenue')
}

export const getShiftsVenueAll = () => {
    return axiosInstanceReservation.get('shiftsVenue/all')
}

export const getShiftsVenueByUUID = (uuid) => {
    return axiosInstanceReservation.get(`shiftsVenue/uuid/${uuid}`)
}

export const getShiftsByVenue = (idVenue) => {
    return axiosInstanceReservation.get(`shiftsVenue/venue/${idVenue}`)
}

export const postShiftsVenue = (data) => {
    return axiosInstanceReservation.post(`shiftsVenue`, data)
}

export const putShiftsVenue = (data, uuid) => {
    return axiosInstanceReservation.put(`shiftsVenue/uuid/${uuid}`, data)
}

export const deleteShiftsVenue = (uuid) => {
    return axiosInstanceReservation.delete(`shiftsVenue/uuid/${uuid}`)
}