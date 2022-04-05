import { axiosInstance } from '../instance';

export const getDiagnosticType = () => {
    return axiosInstance.get('customDataSelect/table/24')
}

export const postDiagnosticType = (data) => {
    return axiosInstance.post('customDataSelect/table/24', data)
}

export const putDiagnosticType = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/24/id/${id}`, data)
}

export const deleteDiagnosticType = (id) => {
    return axiosInstance.post(`customDataSelect/table/24/delete/${id}`)
}

