import { axiosInstance } from '../instance';

export const getPhysicalActivity = () => {
    return axiosInstance.get('customDataSelect/table/25')
}

export const postPhysicalActivity= (data) => {
    return axiosInstance.post('customDataSelect/table/25', data)
}

export const putPhysicalActivity = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/25/id/${id}`, data)
}

export const deletePhysicalActivity= (id) => {
    return axiosInstance.post(`customDataSelect/table/25/delete/${id}`)
}