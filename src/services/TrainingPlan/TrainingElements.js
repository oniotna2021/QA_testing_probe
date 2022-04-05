import { axiosInstance } from '../instance';

export const getOneTrainingElements = (id) => {
    return axiosInstance.get(`trainingelements/${id}`);
}

export const getTrainingElements = (limit = 20, page = 1) => {
    return axiosInstance.get(`trainingelements?limit=${limit}&page=${page}`);
}

export const postTrainingElements = (data) => {
    return axiosInstance.post('trainingelements', data);
}

export const putTrainingElements = (data, id) => {
    return axiosInstance.post(`trainingelements/${id}`, data);
}

export const deleteTrainingElements = (id) => {
    return axiosInstance.post(`trainingelements/delete/${id}`);
}

export const orderListTrainingElements = (data) => {
    return axiosInstance.put(`trainingelements/order`, data);
}