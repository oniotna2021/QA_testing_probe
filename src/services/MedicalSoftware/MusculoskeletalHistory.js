
import { axiosInstance } from '../instance';

export const getMusculoskeletalHistory = () => {
    return axiosInstance.get('customDataSelect/table/16')
}

export const postMusculoskeletalHistory = (data) => {
    return axiosInstance.post('customDataSelect/table/16', data)
}

export const putMusculoskeletalHistory = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/16/id/${id}`, data)
}

export const deleteMusculoskeletalHistory = (id) => {
    return axiosInstance.post(`customDataSelect/table/16/delete/${id}`)
}

