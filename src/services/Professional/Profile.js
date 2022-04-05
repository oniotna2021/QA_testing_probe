import { axiosInstance } from '../instance';

export const getOneMedicalProfiles = (id) => {
    return axiosInstance.get(`medicalProfiles/${id}`);
}

export const getMedicalProfiles = () => {
    return axiosInstance.get('medicalProfiles')
}

export const postMedicalProfiles = (data) => {
    return axiosInstance.post('medicalProfiles', data)
}

export const putMedicalProfiles = (data, id) => {
    return axiosInstance.put(`medicalProfiles/${id}`, data)
}

export const deleteMedicalProfiles = (id) => {
    return axiosInstance.post(`medicalProfiles/delete/${id}`)
}