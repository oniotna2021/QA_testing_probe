import { axiosInstance } from "services/instance";

export const getTypeAlimentation = () => {
    return axiosInstance.get('type-alimentations')
}

export const postTypeAlimentation = (data) => {
    return axiosInstance.post('type-alimentations', data)
}

export const putTypeAlimentation = (id, data) => {
    return axiosInstance.put(`type-alimentations/${id}`, data)
}

export const deleteTypeAlimentation = (id) => {
    return axiosInstance.post(`type-alimentations/delete/${id}`)
}