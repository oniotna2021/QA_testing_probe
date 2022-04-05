import { axiosInstanceReservation } from "../instance";

export const addReserveGroupLesson = (data) => {
  return axiosInstanceReservation.post("customerReservation/groupLesson", data);
};

export const getReserveGroupLessonsByVenue = (venueId, dayWeekId) => {
  return axiosInstanceReservation.get(
    `/customerReservation/groupLesson/shedules/venue/${venueId}/dayWeek/${dayWeekId}`
  );
};

export const getAffiliatesReservationById = (idReservation, page, limit) => {
  return axiosInstanceReservation.get(
    `/customerReservation/activity_reservation/${idReservation}?page=${page}&limit=${limit}`
  );
};

export const deleteReservationByUser = (uuidReservation) => {
  return axiosInstanceReservation.delete(
    `customerReservation/reserve/groupLesson/uuid/${uuidReservation}`
  );
};
