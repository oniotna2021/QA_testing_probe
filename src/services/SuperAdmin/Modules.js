import { axiosInstance } from '../instance';

export const getOneModeType = (id) => {
    return axiosInstance.get(`modules/${id}`);
}

export const getModules = (limit, page) => {
    return axiosInstance.get(`modules?limit=${limit}&page=${page}`)
}

export const getModulesByGroup = (idModuleGroup) => {
    return axiosInstance.get(`modules/by-group/${idModuleGroup}`)
}

export const postModule = (data) => {
    return axiosInstance.post('modules', data)
}

export const putModule = (data, id) => {
    return axiosInstance.put(`modules/${id}`, data)
}

export const deleteModule = (id) => {
    return axiosInstance.post(`modules/delete/${id}`)
}