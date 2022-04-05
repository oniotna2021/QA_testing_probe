import { axiosInstance } from '../instance';

export const getHealthEducation = () => {
    return axiosInstance.get('customDataSelect/table/28')
}

export const postHealthEducation = (data) => {
    return axiosInstance.post('customDataSelect/table/28', data)
}

export const putHealthEducation = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/28/id/${id}`, data)
}

export const deleteHealthEducation = (id) => {
    return axiosInstance.post(`customDataSelect/table/28/delete/${id}`)
}

