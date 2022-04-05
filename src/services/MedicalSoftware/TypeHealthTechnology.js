
import { axiosInstance } from '../instance';

export const getTypeHealthTechnology = () => {
    return axiosInstance.get('customDataSelect/table/32')
}

export const postTypeHealthTechnology= (data) => {
    return axiosInstance.post('customDataSelect/table/32', data)
}

export const putTypeHealthTechnology = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/32/id/${id}`, data)
}

export const deleteTypeHealthTechnology = (id) => {
    return axiosInstance.post(`customDataSelect/table/32/delete/${id}`)
}

