import { axiosInstance } from '../instance';

export const getOneObjectives = (id) => {
    return axiosInstance.get(`goals/${id}`);
}

export const getObjectives = (limit = 20, page = 1) => {
    return axiosInstance.get(`goals?limit=${limit}&page=${page}`);
}

export const postObjectives  = (data) => {
    return axiosInstance.post('goals', data);
}

export const putObjectives  = (data, id) => {
    return axiosInstance.put(`goals/${id}`, data);
}

export const deleteObjectives  = (id) => {
    return axiosInstance.post(`goals/delete/${id}`);
}

export const orderListObjectives = (data) => {
    return axiosInstance.put(`goals/order`, data);
}