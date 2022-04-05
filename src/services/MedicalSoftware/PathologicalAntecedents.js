import { axiosInstance } from '../instance';

export const getPathologicalAntecedents = () => {
    return axiosInstance.get('customDataSelect/table/10')
}

export const postPathologicalAntecedents = (data) => {
    return axiosInstance.post('customDataSelect/table/10', data)
}

export const putPathologicalAntecedents = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/10/id/${id}`, data)
}

export const deletePathologicalAntecedents = (id) => {
    return axiosInstance.post(`customDataSelect/table/10/delete/${id}`)
}