import { axiosInstance } from '../instance';

export const getDisability = () => {
    return axiosInstance.get('customDataSelect/table/4')
}

export const postDisability = (data) => {
    return axiosInstance.post('customDataSelect/table/4', data)
}

export const putDisability = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/4/id/${id}`, data)
}

export const deleteDisability = (id) => {
    return axiosInstance.post(`customDataSelect/table/4/delete/${id}`)
}

