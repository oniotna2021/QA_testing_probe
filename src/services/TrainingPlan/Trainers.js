import { axiosInstance } from '../instance';

export const getOneTrainers = (id) => {
    return axiosInstance.get(`trainers/${id}`);
}

export const getTrainers = () => {
    return axiosInstance.get('trainers');
}

export const postTrainers = (data) => {
    return axiosInstance.post('trainers', data);
}

export const putTrainers = (data, id) => {
    return axiosInstance.put(`trainers/${id}`, data);
}

export const deleteTrainers = (id) => {
    return axiosInstance.post(`trainers/delete/${id}`);
}

// export const orderListTrainers = (data) => {
//     return axiosInstance.put(`goals/order`, data);
// }