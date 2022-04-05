import { axiosInstance } from '../instance';

export const getMainAll = (id) => {
    return axiosInstance.get(`customDataSelect/table/${id}`)
}