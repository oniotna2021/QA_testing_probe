import { axiosInstance } from '../instance';

export const getBloodType = () => {
    return axiosInstance.get('customDataSelect/table/2')
}

export const postBloodType = (data) => {
    return axiosInstance.post('customDataSelect/table/2', data)
}

export const putBloodType = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/2/id/${id}`, data)
}

export const deleteBloodType = (id) => {
    return axiosInstance.post(`customDataSelect/table/2/delete/${id}`)
}