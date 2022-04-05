import { axiosInstance } from '../instance';

export const getSleepPattern = () => {
    return axiosInstance.get('customDataSelect/table/34')
}

export const postSleepPattern = (data) => {
    return axiosInstance.post('customDataSelect/table/34', data)
}

export const putSleepPattern = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/34/id/${id}`, data)
}

export const deleteSleepPattern = (id) => {
    return axiosInstance.post(`customDataSelect/table/34/delete/${id}`)
}