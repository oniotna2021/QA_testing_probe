import { axiosInstance } from '../instance';

export const getMedicalProfessionalVenueShedules = () => {
    return axiosInstance.get('medicalProfesional')
}

export const postMedicalProfessionalVenueShedules = (data) => {
    return axiosInstance.post('medicalProfessional/venueSchedules', data)
}
