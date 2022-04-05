import { axiosInstance } from '../instance';

export const getDiagnosis = () => {
    return axiosInstance.get('customDataSelect/table/23')
}

export const postDiagnosis = (data) => {
    return axiosInstance.post('customDataSelect/table/23', data)
}

export const putDiagnosis = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/23/id/${id}`, data)
}

export const deleteDiagnosis = (id) => {
    return axiosInstance.post(`customDataSelect/table/23/delete/${id}`)
}

