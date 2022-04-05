
import { axiosInstance } from '../instance';

export const getMyCoachIntervention = () => {
    return axiosInstance.get('customDataSelect/table/31')
}

export const postMyCoachIntervention = (data) => {
    return axiosInstance.post('customDataSelect/table/31', data)
}

export const putMyCoachIntervention = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/31/id/${id}`, data)
}

export const deleteMyCoachIntervention = (id) => {
    return axiosInstance.post(`customDataSelect/table/31/delete/${id}`)
}

