import { axiosInstance } from '../instance';

export const getAdminName = () => {
    return axiosInstance.get('customDataSelect/table/19')
}

export const postAdminName = (data) => {
    return axiosInstance.post('customDataSelect/table/19', data)
}

export const putAdminName = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/19/id/${id}`, data)
}

export const deleteAdminName = (id) => {
    return axiosInstance.post(`customDataSelect/table/19/delete/${id}`)
}