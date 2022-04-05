import { axiosInstanceReservation } from "../instance";

export const getScheduleTrainers = (data) => {
  return axiosInstanceReservation.post("/customizedLessons/calendarDays", data);
};
