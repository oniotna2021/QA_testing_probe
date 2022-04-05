import { axiosInstance } from '../instance';

export const getEthnicity = () => {
    return axiosInstance.get('customDataSelect/table/12')
}

export const postEthnicity = (data) => {
    return axiosInstance.post('customDataSelect/table/12', data)
}

export const putEthnicity = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/12/id/${id}`, data)
}

export const deleteEthnicity = (id) => {
    return axiosInstance.post(`customDataSelect/table/12/delete/${id}`)
}