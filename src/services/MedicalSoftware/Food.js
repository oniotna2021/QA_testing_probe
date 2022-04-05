import { axiosInstance } from '../instance';

export const getFood= () => {
    return axiosInstance.get('food')
}

export const postFood = (data) => {
    return axiosInstance.post('food', data)
}

export const putFood = (data, id) => {
    return axiosInstance.put(`food/${id}`, data)
}

export const deleteFood = (id) => {
    return axiosInstance.post(`food/delete/${id}`)
}

export const getFoodByType = (id) => {
    return axiosInstance.get(`food/type/${id}`)
}