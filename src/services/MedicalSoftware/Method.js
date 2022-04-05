import { axiosInstance } from '../instance';

export const getOneMethod = (id) => {
    return axiosInstance.get(`method/${id}`);
}

export const getMethod = () => {
    return axiosInstance.get('method')
}

export const postMethod = (data) => {
    return axiosInstance.post('method', data)
}

export const putMethod = (data, id) => {
    return axiosInstance.put(`method/${id}`, data)
}

export const deleteMethod = (id) => {
    return axiosInstance.post(`method/delete/${id}`)
}