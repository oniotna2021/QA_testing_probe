
import { axiosInstance } from '../instance';

export const getFamilyHistory = () => {
    return axiosInstance.get('customDataSelect/table/17')
}

export const postFamilyHistory = (data) => {
    return axiosInstance.post('customDataSelect/table/17', data)
}

export const putFamilyHistory = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/17/id/${id}`, data)
}

export const deleteFamilyHistory= (id) => {
    return axiosInstance.post(`customDataSelect/table/17/delete/${id}`)
}

