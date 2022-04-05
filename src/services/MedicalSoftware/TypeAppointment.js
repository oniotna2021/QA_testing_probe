
import { axiosInstance } from '../instance';

export const getTypeAppointment = () => {
    return axiosInstance.get('appointmentType')
}

export const postTypeAppointment= (data) => {
    return axiosInstance.post('appointmentType', data)
}

export const putTypeAppointment = (data, id) => {
    return axiosInstance.put(`appointmentType/${id}`, data)
}

export const deleteTypeAppointment = (id) => {
    return axiosInstance.post(`appointmentType/delete/${id}`)
}

