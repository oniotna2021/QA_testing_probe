import { axiosInstanceReservation } from "../instance";

export const getQuotesByRangeDate = (
  startDate,
  endDate,
  appoitmentTypes,
  userId
) => {
  return axiosInstanceReservation.get(`virtualJourney/scheduleEmployeeByDates?appointment_types=${appoitmentTypes}&user_id=${userId}&start_date=${startDate}&end_date=${endDate}
    `);
};

export const getQuotesByMonth = (
  arrayIdUsers,
  month,
  year,
  appoitmentTypes
) => {
  return axiosInstanceReservation.get(
    `virtualJourney/activiesVirtualMonth?users=${arrayIdUsers}&month=${month}&year=${year}&appointment_types=${appoitmentTypes}`
  );
};

export const postQuote = (data, userId) => {
  return axiosInstanceReservation.post(
    `virtualJourney/reserveAvailabilityMyCoach?employee_id=${userId}`,
    data
  );
};

export const postAvailabilityByAppoitment = (data) => {
  return axiosInstanceReservation.post(
    `virtualJourney/availabilityMyCoach/employee`,
    data
  );
};

export const finishQuote = (data) => {
  return axiosInstanceReservation.post(`quotes/finish`, data);
};

export const reasingQuote = (data) => {
  return axiosInstanceReservation.put(
    `virtualJourney/reserveAvailabilityMyCoach`,
    data
  );
};
