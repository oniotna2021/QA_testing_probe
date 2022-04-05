import { axiosInstance } from '../instance';

export const getSurgeryTimes = () => {
    return axiosInstance.get('customDataSelect/table/11')
}

export const postSurgeryTimes = (data) => {
    return axiosInstance.post('customDataSelect/table/11', data)
}

export const putSurgeryTimes = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/11/id/${id}`, data)
}

export const deleteSurgeryTimes = (id) => {
    return axiosInstance.post(`customDataSelect/table/11/delete/${id}`)
}