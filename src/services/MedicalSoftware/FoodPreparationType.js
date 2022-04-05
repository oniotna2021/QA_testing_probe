import { axiosInstance } from '../instance';

export const getFoodPreparationType= () => {
    return axiosInstance.get('customDataSelect/table/29')
}

export const postFoodPreparationType = (data) => {
    return axiosInstance.post('customDataSelect/table/29', data)
}

export const putFoodPreparationType = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/29/id/${id}`, data)
}

export const deleteFoodPreparationType = (id) => {
    return axiosInstance.post(`customDataSelect/table/29/delete/${id}`)
}