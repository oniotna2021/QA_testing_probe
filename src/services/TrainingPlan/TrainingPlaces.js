import { axiosInstance } from '../instance';

export const getOneTrainingPlaces = (id) => {
    return axiosInstance.get(`trainingplaces/${id}`);
}

export const getTrainingPlaces = () => {
    return axiosInstance.get('trainingplaces');
}

export const postTrainingPlaces = (data) => {
    return axiosInstance.post('trainingplaces', data);
}

export const putTrainingPlaces = (data, id) => {
    return axiosInstance.put(`trainingplaces/${id}`, data);
}

export const deleteTrainingPlaces = (id) => {
    return axiosInstance.post(`trainingplaces/delete/${id}`);
}

export const orderListTrainingPlaces = (data) => {
    return axiosInstance.put(`trainingplaces/order`, data);
}