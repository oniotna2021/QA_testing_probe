import { axiosInstance } from '../instance';

export const getOMSRisk = () => {
    return axiosInstance.get('customDataSelect/table/30')
}

export const postOMSRisk = (data) => {
    return axiosInstance.post('customDataSelect/table/30', data)
}

export const putOMSRisk = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/30/id/${id}`, data)
}

export const deleteOMSRisk = (id) => {
    return axiosInstance.post(`customDataSelect/table/30/delete/${id}`)
}

