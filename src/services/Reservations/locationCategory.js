import { axiosInstanceReservation } from '../instance';

export const getLocationCategoryById = (id) => {
    return axiosInstanceReservation.get(`locationCategory/uuid/${id}`);
}

export const getLocationCategoryByVenue = (idVenue) => {
    return axiosInstanceReservation.get(`locationCategory/venue/${idVenue}`);
}

export const getAllLocationCategory = () => {
    return axiosInstanceReservation.get('locationCategory/all')
}

export const getLocationCategoryByName= (name) => {
    return axiosInstanceReservation.get(`locationCategory/name/${name}`)
}

export const getLastCreatedAtLocationCategory = () => {
    return axiosInstanceReservation.get(`locationCategory/last`)
}

export const getLocationCategoryPagination = (limit, page) => {
    return axiosInstanceReservation.get(`locationCategory?limit=${limit}&page=${page}`)
}

export const postLocationCategory = (data) => {
    return axiosInstanceReservation.post('locationCategory', data)
}

export const postAddLocationCategoryHasVenue = (data) => {
    return axiosInstanceReservation.post('locationCategory', data)
}

export const putLocationCategory = (data, id) => {
    return axiosInstanceReservation.put(`locationCategory/uuid/${id}`, data)
}

export const deleteLocationCategory = (id) => {
    return axiosInstanceReservation.delete(`locationCategory/uuid/${id}`)
}