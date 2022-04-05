import { axiosInstance } from '../instance';

export const getWeightUnit = () => {
    return axiosInstance.get('weightUnit')
}

export const postWeightUnit = (data) => {
    return axiosInstance.post('weightUnit', data)
}

export const putWeightUnit = (id, data) => {
    return axiosInstance.put(`weightUnit/${id}`, data)
}

export const deleteWeightUnit = (id) => {
    return axiosInstance.post(`weightUnit/delete/${id}`)
}