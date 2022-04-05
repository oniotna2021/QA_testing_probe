import { axiosInstance } from '../instance';

export const getQueryType = () => {
    return axiosInstance.get('customDataSelect/table/9')
}

export const postQueryType = (data) => {
    return axiosInstance.post('customDataSelect/table/9', data)
}

export const putQueryType = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/9/id/${id}`, data)
}

export const deleteQueryType = (id) => {
    return axiosInstance.post(`customDataSelect/table/9/delete/${id}`)
}