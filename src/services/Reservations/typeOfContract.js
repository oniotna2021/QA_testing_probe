import { axiosInstanceGeneralConfig } from '../instance';

export const getTypeOfContractById = (id) => {
    return axiosInstanceGeneralConfig.get(`type-contract/uuid/${id}`);
}

export const getAllTypeOfContract = () => {
    return axiosInstanceGeneralConfig.get('type-contract/all')
}

export const getLastTypeOfContract = () => {
    return axiosInstanceGeneralConfig.get('type-contract/last')
}

export const getTypeOfContractPagination = (limit, page) => {
    return axiosInstanceGeneralConfig.get(`type-contract?limit=${limit}&page=${page}`)
}

export const postTypeOfContract = (data) => {
    return axiosInstanceGeneralConfig.post('type-contract', data)
}

export const putTypeOfContract = (data, id) => {
    return axiosInstanceGeneralConfig.put(`type-contract/uuid/${id}`, data)
}

export const deleteTypeOfContract = (id) => {
    return axiosInstanceGeneralConfig.delete(`type-contract/uuid/${id}`)
}