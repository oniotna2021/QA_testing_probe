import { axiosInstance } from '../instance';

export const getSystemGateway = () => {
    return axiosInstance.get('customDataSelect/table/8')
}

export const postSystemGateway = (data) => {
    return axiosInstance.post('customDataSelect/table/8', data)
}

export const putSystemGateway = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/8/id/${id}`, data)
}

export const deleteSystemGateway = (id) => {
    return axiosInstance.post(`customDataSelect/table/8/delete/${id}`)
}