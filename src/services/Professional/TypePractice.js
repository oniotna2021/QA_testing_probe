import { axiosInstance } from '../instance';

export const getOneTypePractice = (id) => {
    return axiosInstance.get(`typeMedicalPractice/${id}`);
}

export const getTypePractice = () => {
    return axiosInstance.get('typeMedicalPractice')
}

export const postTypePractice = (data) => {
    return axiosInstance.post('typeMedicalPractice', data)
}

export const putTypePractice = (data, id) => {
    return axiosInstance.put(`typeMedicalPractice/${id}`, data)
}

export const deleteTypePractice = (id) => {
    return axiosInstance.post(`typeMedicalPractice/delete/${id}`)
}