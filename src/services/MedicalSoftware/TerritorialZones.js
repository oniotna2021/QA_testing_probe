import { axiosInstance } from '../instance';

export const getTerritorialZones = () => {
    return axiosInstance.get('customDataSelect/table/14')
}

export const postTerritorialZones = (data) => {
    return axiosInstance.post('customDataSelect/table/14', data)
}

export const putTerritorialZones = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/14/id/${id}`, data)
}

export const deleteTerritorialZones = (id) => {
    return axiosInstance.post(`customDataSelect/table/14/delete/${id}`)
}

