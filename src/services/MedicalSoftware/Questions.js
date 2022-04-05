import { axiosInstance } from '../instance';

export const postIndexDownton = (data) => {
    return axiosInstance.post('indiceDownton', data)
}

export const getLastIndexDownton = (id) => {
    return axiosInstance.get(`indiceDownton/${id}`)
}

export const postCardiovascularRisk = (data) => {
    return axiosInstance.post('cardiovascularRisk', data)
}

export const getLastCardiovascularRisk = (id) => {
    return axiosInstance.get(`cardiovascularRisk/${id}`)
}

export const postBodytechRisk = (data) => {
    return axiosInstance.post('surveyRiskRating', data)
}

export const getLastBodytechRisk = (id) => {
    return axiosInstance.get(`surveyRiskRating/user/${id}`)
}

export const getLastPhysicalMedical = (id) => {
    return axiosInstance.get(`surveyPhysicalEvaluation/user/${id}`)
}

export const postPhysicalMedical = (data) => {
    return axiosInstance.post('surveyPhysicalEvaluation', data)
}

export const getPhysicalEvaluationBySurvery = (id) => {
    return axiosInstance.get(`surveyPhysicalEvaluation/id/${id}`)
}