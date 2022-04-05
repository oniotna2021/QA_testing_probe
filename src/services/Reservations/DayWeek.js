import { axiosInstanceGeneralConfig } from '../instance';

export const getAllDayWeeks = () => {
    return axiosInstanceGeneralConfig.get('dayweek/all')
}

export const getDayWeeksPagination = (limit, page) => {
    return axiosInstanceGeneralConfig.get(`dayweek?limit=${limit}&page=${page}`)
}

export const getDayWeekByUUID = (uuid) => {
    return axiosInstanceGeneralConfig.get(`dayweek/uuid/${uuid}`)
}

export const postDayWeek = (data) => {
    return axiosInstanceGeneralConfig.post('dayweek', data)
}

export const putDayWeek = (data, uuid) => {
    return axiosInstanceGeneralConfig.put(`dayweek/uuid/${uuid}`, data)
}

export const deleteDayWeek = (uuid) => {
    return axiosInstanceGeneralConfig.delete(`DayWeek/uuid/${uuid}`)
}