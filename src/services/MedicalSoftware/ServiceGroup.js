import { axiosInstance } from '../instance';

export const getServiceGroup = () => {
    return axiosInstance.get('customDataSelect/table/7')
}

export const postServiceGroup = (data) => {
    return axiosInstance.post('customDataSelect/table/7', data)
}

export const putServiceGroup = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/7/id/${id}`, data)
}

export const deleteServiceGroup = (id) => {
    return axiosInstance.post(`customDataSelect/table/7/delete/${id}`)
}