import { axiosInstance } from '../instance';

export const getOneModeType = (id) => {
    return axiosInstance.get(`modeType/${id}`);
}

export const getModeType = () => {
    return axiosInstance.get('modeType')
}

export const postModeType = (data) => {
    return axiosInstance.post('modeType', data)
}

export const putModeType = (data, id) => {
    return axiosInstance.put(`modeType/${id}`, data)
}

export const deleteModeType = (id) => {
    return axiosInstance.post(`modeType/delete/${id}`)
}