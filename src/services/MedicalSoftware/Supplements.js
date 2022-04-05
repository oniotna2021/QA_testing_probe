import { axiosInstance } from '../instance';

export const getSupplements = () => {
    return axiosInstance.get('customDataSelect/table/27')
}

export const postSupplements = (data) => {
    return axiosInstance.post('customDataSelect/table/27', data)
}

export const putSupplements = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/27/id/${id}`, data)
}

export const deleteSupplements = (id) => {
    return axiosInstance.post(`customDataSelect/table/27/delete/${id}`)
}