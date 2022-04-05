import { axiosInstanceReservation } from '../instance';

export const getQuotesByDate = (venue, date) => {
    return axiosInstanceReservation.get(`quotes/venue/${venue}/date/${date}`)
}

export const getQuotesByMonthForMedical = (year, month, id_medical) => {
    return axiosInstanceReservation.get(`quotes/year/${year}/month/${month}/medical/${id_medical}`)
}                            

export const getQuotesByMonth = (venue, year, month) => {
    return axiosInstanceReservation.get(`quotes/year/${year}/month/${month}/venue/${venue}`)
}

//to change
export const getQuotesByProfessionalID = (idx,date,venues) => {
    return axiosInstanceReservation.get(`quotes/medicalProfesional/${idx}/date/${date}?venues=[${venues}]`)
}

export const getQuotesForDay = (date, venue) => {
    return axiosInstanceReservation.get(`quotes/quote_date/${date}/venue/${venue}`)
}

export const getQuotesByProfessionalDocument = (idx) => {
    return axiosInstanceReservation.get(`quotes/medicalProfesional/doc/${idx}`)
}

export const finishQuote = (data) => {
    return axiosInstanceReservation.post('quotes/finish',data)
}

export const startQuote = (data) => {
    return axiosInstanceReservation.post('quotes/start',data)
}

export const getQuoteById = (id) => {
    return axiosInstanceReservation.get(`quotes/${id}`)
}

export const initClinicalHistoryForced = (data) => {
    return axiosInstanceReservation.post('quotesReservation/force', data)
}