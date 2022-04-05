import { axiosInstance } from '../instance';

export const getPlaceAttention = () => {
    return axiosInstance.get('customDataSelect/table/35')
}

export const postPlaceAttention = (data) => {
    return axiosInstance.post('customDataSelect/table/35', data)
}

export const putPlaceAttention = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/35/id/${id}`, data)
}

export const deletePlaceAttention = (id) => {
    return axiosInstance.post(`customDataSelect/table/35/delete/${id}`)
}