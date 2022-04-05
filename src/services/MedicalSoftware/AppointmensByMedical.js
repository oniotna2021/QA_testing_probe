import { axiosInstanceReservation } from '../instance';

export const getAppointmentsByMedical = (venue) => {
    return axiosInstanceReservation.get(`quotes/professional_venue/${venue}`)
}