import { axiosInstance } from '../instance';

export const postMedicalSuggestion = (data) => {
    return axiosInstance.post('medicalSuggestions', data)
}


export const getMedicalSuggestionByUser = (id) => {
    return axiosInstance.get(`medicalSuggestions/user/${id}`)
}

export const getDetailMedicalSuggestionById = (id) => {
    return axiosInstance.get(`medicalSuggestions/datail/${id}`)
}