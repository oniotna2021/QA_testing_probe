import { axiosInstance, axiosInstanceGeneralConfig } from './instance';

export const getCitis = () => {
    return axiosInstance.get('microServices/cities');
}


export const getVenuesForNear = (value) => {
    return axiosInstance.post('lupap/venuesNear', value);
}


export const getVenues = () => {
    return axiosInstance.get('microServices/venue');
}

export const getCountries = () => {
    return axiosInstanceGeneralConfig.get('country/all')
}