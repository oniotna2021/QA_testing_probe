import { axiosInstanceGeneralConfig } from '../instance';

export const getAttributeById = (id) => {
    return axiosInstanceGeneralConfig.get(`attribute/uuid/${id}`);
}

export const getAllAttributes = () => {
    return axiosInstanceGeneralConfig.get('attribute')
}

export const getAttributesPagination = (limit, page) => {
    return axiosInstanceGeneralConfig.get(`attribute?limit=${limit}&page=${page}`)
}

export const postAttribute = (data) => {
    return axiosInstanceGeneralConfig.post('attribute', data)
}

export const putAttribute = (data, id) => {
    return axiosInstanceGeneralConfig.put(`attribute/uuid/${id}`, data)
}

export const deleteAttribute = (id) => {
    return axiosInstanceGeneralConfig.delete(`attribute/uuid/${id}`)
}