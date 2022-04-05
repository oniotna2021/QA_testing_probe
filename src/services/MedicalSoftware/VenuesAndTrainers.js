import { axiosInstance } from '../instance';

export const getVenuesByCity = (id) => {
    return axiosInstance.get(`microServices/venue/city/${id}`)
}

export const getTrainers = (id) => {
    return axiosInstance.get(`trainers/venue/${id}`)
}