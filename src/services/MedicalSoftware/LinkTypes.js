import { axiosInstance } from '../instance';

export const getLinkTypes = () => {
    return axiosInstance.get('customDataSelect/table/5')
}

export const postLinkTypes = (data) => {
    return axiosInstance.post('customDataSelect/table/5', data)
}

export const putLinkTypes = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/5/id/${id}`, data)
}

export const deleteLinkTypes = (id) => {
    return axiosInstance.post(`customDataSelect/table/5/delete/${id}`)
}