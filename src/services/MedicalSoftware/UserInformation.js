import { axiosInstance } from '../instance';

export const getUserInformation = (doc, typeDoc) => {
    if(typeDoc) {
        return axiosInstance.get(`microServices/user/document/${doc}?document_type=${typeDoc}`)
    }

    return axiosInstance.get(`microServices/user/document/${doc}`)
}

export const putAssingTrainer = (data) => {
    return axiosInstance.put(`trainers/assign-trainer`, data)
}

export const getReasonQuoteByUser = (id) => {
    return axiosInstance.get(`reasonQuote/user/${id}`)
}

export const getHealthConditionByUser = (id) => {
    return axiosInstance.get(`healthCondition/last/user/${id}`)
}

export const getLastFiveReasonQuotesByUser = (id) => {
    return axiosInstance.get(`reasonQuote/last/user/${id}`)
}

export const getUserInformationToClinicalHistory = (id) => {
    return axiosInstance.get(`patient/profile/${id}`)
}
