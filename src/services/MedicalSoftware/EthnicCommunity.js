import { axiosInstance } from '../instance';

export const getEthnicCommunity= () => {
    return axiosInstance.get('customDataSelect/table/20')
}

export const postEthnicCommunity = (data) => {
    return axiosInstance.post('customDataSelect/table/20', data)
}

export const putEthnicCommunity = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/20/id/${id}`, data)
}

export const deleteEthnicCommunity = (id) => {
    return axiosInstance.post(`customDataSelect/table/20/delete/${id}`)
}