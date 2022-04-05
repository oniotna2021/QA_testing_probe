import { axiosInstance } from '../instance';

export const getRelationship = () => {
    return axiosInstance.get('customDataSelect/table/33')
}

export const postRelationship = (data) => {
    return axiosInstance.post('customDataSelect/table/33', data)
}

export const putRelationship = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/33/id/${id}`, data)
}

export const deleteRelationship = (id) => {
    return axiosInstance.post(`customDataSelect/table/33/delete/${id}`)
}