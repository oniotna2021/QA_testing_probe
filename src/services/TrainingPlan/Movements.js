import { axiosInstance } from '../instance';

export const getOneMovement = (id) => {
    return axiosInstance.get(`medicalcondition/${id}`);
}

export const getMovements = (limit = 20, page = 1) => {
    return axiosInstance.get(`movements?limit=${limit}&page=${page}`);
}

export const postMovements = (data) => {
    return axiosInstance.post('movements', data);
}

export const putMovements = (data, id) => {
    return axiosInstance.put(`movements/${id}`, data);
}

export const deleteMovement = (id) => {
    return axiosInstance.post(`movements/delete/${id}`);
}

export const orderListMovements = (data) => {
    return axiosInstance.put(`movements/order`, data);
}