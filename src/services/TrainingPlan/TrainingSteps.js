import { axiosInstance } from '../instance';

export const getOneTrainingSteps = (id) => {
    return axiosInstance.get(`trainingsteps/${id}`);
}

export const getTrainingSteps = () => {
    return axiosInstance.get('trainingsteps');
}

export const postTrainingSteps = (data) => {
    return axiosInstance.post('trainingsteps', data);
}

export const putTrainingSteps = (data, id) => {
    return axiosInstance.put(`trainingsteps/${id}`, data);
}

export const deleteTrainingSteps = (id) => {
    return axiosInstance.post(`trainingsteps/delete/${id}`);
}

export const orderListTrainingSteps = (data) => {
    return axiosInstance.put(`trainingsteps/order`, data);
}