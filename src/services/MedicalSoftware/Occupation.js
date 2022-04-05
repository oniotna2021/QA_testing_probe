import { axiosInstance } from '../instance';

export const getOccupation = () => {
    return axiosInstance.get('customDataSelect/table/3')
}

export const postOccupation = (data) => {
    return axiosInstance.post('customDataSelect/table/3', data)
}

export const putOccupation = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/3/id/${id}`, data)
}

export const deleteOccupation = (id) => {
    return axiosInstance.post(`customDataSelect/table/3/delete/${id}`)
}

