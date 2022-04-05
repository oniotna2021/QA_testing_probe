import { axiosInstance } from '../instance';

export const getMedicalProfessional = () => {
    return axiosInstance.get('medicalProfessional')
}

export const postMedicalProfessional = (data) => {
    return axiosInstance.post('authentication/user', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })       
}

export const putUserCollaborator = (data, idCollaborator) => {
    return axiosInstance.post(`authentication/user/update/${idCollaborator}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })       
}
