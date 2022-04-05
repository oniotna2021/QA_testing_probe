import { axiosInstance } from '../instance';

export const getHealthTechnology= () => {
    return axiosInstance.get('customDataSelect/table/22')
}

export const postHealthTechnology = (data) => {
    return axiosInstance.post('customDataSelect/table/22', data)
}

export const putHealthTechnology = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/22/id/${id}`, data)
}

export const deleteHealthTechnology = (id) => {
    return axiosInstance.post(`customDataSelect/table/22/delete/${id}`)
}