import { axiosInstance } from '../instance';

export const getCauseAttention = () => {
    return axiosInstance.get('customDataSelect/table/15')
}

export const postCauseAttention = (data) => {
    return axiosInstance.post('customDataSelect/table/15', data)
}

export const putCauseAttention = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/15/id/${id}`, data)
}

export const deleteCauseAttention = (id) => {
    return axiosInstance.post(`customDataSelect/table/15/delete/${id}`)
}

