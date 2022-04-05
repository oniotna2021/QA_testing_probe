import { axiosInstance } from '../instance';

export const getReasonConsultation = () => {
    return axiosInstance.get('customDataSelect/table/13')
}

export const postReasonConsultation = (data) => {
    return axiosInstance.post('customDataSelect/table/13', data)
}

export const putReasonConsultation = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/13/id/${id}`, data)
}

export const deleteReasonConsultation = (id) => {
    return axiosInstance.post(`customDataSelect/table/13/delete/${id}`)
}