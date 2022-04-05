import { axiosInstance } from '../instance';

export const getGenderIdentity = () => {
    return axiosInstance.get('customDataSelect/table/1')
}

export const postGenderIdentity = (data) => {
    return axiosInstance.post('customDataSelect/table/1', data)
}

export const putGenderIdentity = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/1/id/${id}`, data)
}

export const deleteGenderIdentity = (id) => {
    return axiosInstance.post(`customDataSelect/table/1/delete/${id}`)
}

