import { axiosInstance } from '../instance';

export const getPermissionById = (id) => {
    return axiosInstance.get(`permissions/${id}`);
}

export const getPermissions = () => {
    return axiosInstance.get('permissions')
}

export const postPermissions = (data) => {
    return axiosInstance.post('permissions', data)
}

export const putPermissions = (data, id) => {
    return axiosInstance.put(`permissions/${id}`, data)
}

export const deletePermission = (id) => {
    return axiosInstance.post(`permissions/delete/${id}`)
}