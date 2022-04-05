import { axiosInstanceReservation } from "../instance";

export const getActivitiesByVenueByMonth = (venueId, year, month) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/activitiesByVenues?venue_id=${venueId}&venue=${venueId}&year=${year}&month=${month}`
  );
};

export const getActivitiesByVenueByDay = (venueId, date) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/detailActivitiesBydate?date=${date}&venue_id=${venueId}`
  );
};

export const getActivityScheduleByDate = (
  activityId = "7",
  startData = "2021-11-02",
  endData = "2021-11-22",
  startTime = "23:05:00",
  endTime = "05:05:00",
  typeInactivate = "temp"
) => {
  return axiosInstanceReservation.get(
    `NewActivity/locationActivity/${activityId}?start_date=${startData} ${startTime}&end_date=${endData} ${endTime}&news_type=${typeInactivate}`
  );
};

export const postInactivateActivity = (data) => {
  return axiosInstanceReservation.post(`NewActivity`, data);
};

export const postInactivateActivityByCalendar = (data) => {
  return axiosInstanceReservation.post(`scheduleGroupLessons/inactivity`, data);
};
