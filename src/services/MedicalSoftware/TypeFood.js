import { axiosInstance } from '../instance';

export const getTypeFood= () => {
    return axiosInstance.get('foodType?limit=30')
}

export const postTypeFood = (data) => {
    return axiosInstance.post('foodType', data)
}

export const putTypeFood = (data, id) => {
    return axiosInstance.put(`foodType/${id}`, data)
}

export const deleteTypeFood = (id) => {
    return axiosInstance.post(`foodType/delete/${id}`)
}