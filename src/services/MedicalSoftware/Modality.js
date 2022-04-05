import { axiosInstance } from "services/instance";

export const getModality = () =>{
    return axiosInstance.get('customDataSelect/table/50')
}

export const postModality = (data) => {
    return axiosInstance.post('customDataSelect/table/50', data)
}

export const putModality = (data, id) => {
    return axiosInstance.put(`customDataSelect/table/50/id/${id}`, data)
}

export const deleteModality = (id) => {
    return axiosInstance.post(`customDataSelect/table/50/delete/${id}`)
}         