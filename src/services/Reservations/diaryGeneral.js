import { axiosInstanceReservation } from "../instance";

export const getDiaryGeneralByMonth = (
  idVenue,
  year,
  month,
  idProfile,
  isVirtual
) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/general?venue_id=${idVenue}&year=${year}&month=${month}&profile_id=${idProfile}`
  );
};

export const getDiaryGeneralByMonthRefactored = (
  idVenue,
  year,
  month,
  idProfile,
  isVirtual
) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/generalRefactored?venue_id=${idVenue}&year=${year}&month=${month}&profile_id=${idProfile}`,
    {
      headers: {
        "X-Bodytech-Virtual-Option": isVirtual ? 1 : 0,
      },
    }
  );
};

export const getDiaryGeneralByMonthByAppointmentType = (
  idVenue,
  year,
  month,
  idTypeQuote
) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/ActivitiesGeneralAppointmentType?venue_id=${idVenue}&year=${year}&month=${month}&&appointment_type_id=${idTypeQuote}`
  );
};

export const getDiaryGeneralByDay = (idVenue, date, idProfile) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/activitiesDate?date=${date}&venue_id=${idVenue}&profile_id=${idProfile}`
  );
};

export const getDiaryGeneralByDayRefactored = (
  idVenue,
  date,
  idProfile,
  isVirtual
) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/activitiesDateRefactored?date=${date}&venue_id=${idVenue}&profile_id=${idProfile}`,
    {
      headers: {
        "X-Bodytech-Virtual-Option": isVirtual ? 1 : 0,
      },
    }
  );
};

export const getDiaryGeneralByDayByAppointmentType = (
  idVenue,
  date,
  idTypeQuote
) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/activitiesDateRefactoredAppointmentType?date=${date}&venue_id=${idVenue}&appointment_type_id=${idTypeQuote}`
  );
};
