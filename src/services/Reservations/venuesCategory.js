import { axiosInstanceGeneralConfig } from '../instance';

export const getVenueCategoryId = (id) => {
    return axiosInstanceGeneralConfig.get(`category-venue/uuid/${id}`);
}

export const getAllVenueCategory = () => {
    return axiosInstanceGeneralConfig.get('category-venue/all')
}

export const orderVenueCategories = (data) => {
    return axiosInstanceGeneralConfig.put('category-venue/position', data)
}

export const getVenueByName= (name) => {
    return axiosInstanceGeneralConfig.get(`category-venue/name/${name}`)
}

export const getLastCreatedAtVenueCategory = ({date}) => {
    return axiosInstanceGeneralConfig.get(`category-venue/date/${date}`)
}

export const getVenueCategoryPagination = (limit, page) => {
    return axiosInstanceGeneralConfig.get(`category-venue?limit=${limit}&page=${page}`)
}

export const postVenueCategory = (data) => {
    return axiosInstanceGeneralConfig.post('category-venue', data)
}

export const putVenueCategory = (data, id) => {
    return axiosInstanceGeneralConfig.put(`category-venue/uuid/${id}`, data)
}

export const deleteVenueCategory = (id) => {
    return axiosInstanceGeneralConfig.delete(`category-venue/uuid/${id}`)
}