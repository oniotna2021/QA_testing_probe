import { axiosInstanceWebPage, axiosInstanceGeneralConfig, axiosInstance } from '../instance';

export const getCountries = () => {
    return axiosInstanceGeneralConfig.get('country/all')
}

export const getCitiesByCountry = (id) => {
    return axiosInstanceWebPage.get(`listByCountry/${id}`)
}

export const getCitiesByCountryCrud = (id) => {
    return axiosInstanceGeneralConfig.get(`city/information?country=${id}`)
}

export const getTypeDocumentByCountry = (id) => {
    return axiosInstanceWebPage.get(`listTypeDocument/${id}/country`)
}

export const getVenuesByCity = (id) => {
    return axiosInstance.get(`microServices/venue/city/${id}`)
}