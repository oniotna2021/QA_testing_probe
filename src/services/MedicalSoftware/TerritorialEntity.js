import { axiosInstance } from '../instance';

export const getTerritorialEntity = () => {
    return axiosInstance.get('customDataSelect/table/6')
}

export const postTerritorialEntity = (data) => {
    return axiosInstance.post('customDataSelect/table/6', data)
}

export const putTerritorialEntity = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/6/id/${id}`, data)
}

export const deleteTerritorialEntity = (id) => {
    return axiosInstance.post(`customDataSelect/table/6/delete/${id}`)
}