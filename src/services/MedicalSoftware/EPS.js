import { axiosInstance } from '../instance';

export const getEPS = () => {
    return axiosInstance.get('customDataSelect/table/36')
}

export const postEPS = (data) => {
    return axiosInstance.post('customDataSelect/table/36', data)
}

export const putEPS = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/36/id/${id}`, data)
}

export const deleteEPS = (id) => {
    return axiosInstance.post(`customDataSelect/table/36/delete/${id}`)
}

