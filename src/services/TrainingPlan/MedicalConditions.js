import { axiosInstance } from '../instance';

export const getOneMedicalConditions = (id) => {
    return axiosInstance.get(`medicalcondition/${id}`);
}

export const getMedicalConditions = () => {
    return axiosInstance.get('medicalcondition?page=1&limit=100');
}

export const postMedicalConditions = (data) => {
    return axiosInstance.post('medicalcondition', data);
}

export const putMedicalConditions = (data, id) => {
    return axiosInstance.put(`medicalcondition/${id}`, data);
}

export const deleteMedicalConditions = (id) => {
    return axiosInstance.post(`medicalcondition/delete/${id}`);
}

export const orderListMedicalConditions = (data) => {
    return axiosInstance.put(`medicalcondition/order`, data);
}