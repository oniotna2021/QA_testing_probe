import { axiosInstanceGeneralConfig } from '../instance';

export const getAllDaysFestives = () => {
    return axiosInstanceGeneralConfig.get('masterfestive/all')
}

export const getDaysFestivesByCountry = (country_id) => {
    return axiosInstanceGeneralConfig.get(`masterfestive/id_country/${country_id}`)
}

export const getDayFestiveByUUID = (uuid) => {
    return axiosInstanceGeneralConfig.get(`masterfestive/getDayFestive/${uuid}/uuid`)
}

export const postDayFestive = (data) => {
    return axiosInstanceGeneralConfig.post('masterfestive/add', data)
}

export const putDayFestive = (data, uuid) => {
    return axiosInstanceGeneralConfig.put(`masterfestive/put/${uuid}/uuid`, data)
}

export const getIsFestiveByRangeDays = (startDate, endDate, idCountry) => {
    return axiosInstanceGeneralConfig.get(`masterfestive/dates?start_date=${startDate}&end_date=${endDate}&country_id=${idCountry}`)
}