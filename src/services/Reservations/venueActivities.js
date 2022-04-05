import { axiosInstanceReservation } from '../instance';


export const getActivitesByVenue = (idVenue) => {
    return axiosInstanceReservation.get(`scheduleActivity/activities/venue/${idVenue}`)
}

export const postAddScheduleActivity = (data) => {
    return axiosInstanceReservation.post('scheduleActivity', data)
}

export const validateScheduleActivity = (data) => {
    return axiosInstanceReservation.post('scheduleActivity/validate/schedules', data)
}

export const putScheduleActivity = (data, idVenue) => {
    return axiosInstanceReservation.put(`scheduleActivity/locationActivity/${idVenue}`, data)
}

// export const deleteLocationHasVenue = (id) => {
//     return axiosInstanceReservation.delete(`location/uuid/${id}`)
// }