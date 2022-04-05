import { axiosInstance } from '../instance';

export const getProcedure= () => {
    return axiosInstance.get('customDataSelect/table/37')
}

export const postProcedure = (data) => {
    return axiosInstance.post('customDataSelect/table/37', data)
}

export const putProcedure = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/37/id/${id}`, data)
}

export const deleteProcedure = (id) => {
    return axiosInstance.post(`customDataSelect/table/37/delete/${id}`)
}