import { axiosInstance } from '../instance';

export const getOneSkillsMedical = (id) => {
    return axiosInstance.get(`skillsMedicalProfiles/${id}`);
}

export const getSkillsMedical = () => {
    return axiosInstance.get('skillsMedicalProfiles')
}

export const postSkillsMedical = (data) => {
    return axiosInstance.post('skillsMedicalProfiles', data)
}

export const putSkillsMedical = (data, id) => {
    return axiosInstance.put(`skillsMedicalProfiles/${id}`, data)
}

export const deleteSkillsMedical = (id) => {
    return axiosInstance.post(`skillsMedicalProfiles/delete/${id}`)
}