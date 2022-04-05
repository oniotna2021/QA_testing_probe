import { axiosInstanceReservation, axiosInstance } from '../instance';

export const getActivitiesByUser = (arrayIdUsers, venueId, month, year) => {
    return axiosInstanceReservation.get(`scheduleEmployee/activies?users=${arrayIdUsers}&venue=${venueId}&month=${month}&year=${year}`);
}

export const getActivitiesByUserRefactored = (arrayIdUsers, venueId, month, year) => {
    return axiosInstanceReservation.get(`scheduleEmployee/activiesRefactored?users=${arrayIdUsers}&venue=${venueId}&month=${month}&year=${year}`);
}

export const getActivitiesByWeek = (arrayIdUsers, venueId, dateIni, dateEnd) => {
    return axiosInstanceReservation.get(`scheduleEmployee/week?users=${arrayIdUsers}&venue=${venueId}&date_ini=${dateIni}&date_end=${dateEnd}`);
}

export const getActivitiesByWeekRefractored = (arrayIdUsers, venueId, dateIni, dateEnd) => {
    return axiosInstanceReservation.get(`scheduleEmployee/weekRefactored?users=${arrayIdUsers}&venue=${venueId}&date_ini=${dateIni}&date_end=${dateEnd}`);
}

export const getQuotesMedicalByWeek = (userId, venueId, dateIni, dateEnd) => {
    return axiosInstance.get(`medicalProfessional/availability?user_id=${userId}&venue_id=${venueId}&startDate=${dateIni}&endDate=${dateEnd}`);
}

export const getActivitesGeneral = (venueId, year, month, idProfile) => {
    return axiosInstanceReservation.get(`scheduleEmployee/general?venue_id=${venueId}&year=${year}&month=${month}&profile_id=${idProfile}`)
}

export const postActivityByDates = (data) => {
    return axiosInstanceReservation.post('scheduleActivity/byDates', data)
}

export const putActivityReservation = (data) => {
    return axiosInstanceReservation.put('activityReservation', data)
}

export const postNewsEmployee = (data) => {
    return axiosInstanceReservation.post('newsEmployee', data)
}

export const deleteNewsEmployee = (data) => {
    return axiosInstanceReservation.delete(`newsEmployee?news=${data}`)
}

export const getSchedulesToEnableByDate = (userInternalId, startDate, endDate, venueId) => {
    return axiosInstanceReservation.get(`newsEmployee/byDates?user_internal_id=${userInternalId}&start_date=${startDate}&end_date=${endDate}&venue_id=${venueId}`)
}

export const getActivitesScheduleEmployee = (userInternalId, startDate, endDate, venueId, isRangeHours) => {
    return axiosInstanceReservation.get(`newsEmployee/standby/schedules?user_internal_id=${userInternalId}&start_date=${startDate}&end_date=${endDate}&venue_id=${venueId}&range_hours=${isRangeHours}`)
}


