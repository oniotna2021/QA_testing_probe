import { axiosInstance } from '../instance';

export const getOneTrainingLevels = (id) => {
    return axiosInstance.get(`traininglevels/${id}`);
}

export const getTrainingLevels = (limit = 20, page = 1) => {
    return axiosInstance.get(`/traininglevels?limit=${limit}&page=${page}`);
}

export const postTrainingLevels = (data) => {
    return axiosInstance.post('traininglevels', data);
}

export const putTrainingLevels = (data, id) => {
    return axiosInstance.put(`traininglevels/${id}`, data);
}

export const deleteTrainingLevels = (id) => {
    return axiosInstance.post(`traininglevels/delete/${id}`);
}

export const orderListTrainingLevels = (data) => {
    return axiosInstance.put(`traininglevels/order`, data);
}