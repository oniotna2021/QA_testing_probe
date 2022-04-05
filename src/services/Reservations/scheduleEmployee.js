import { axiosInstanceReservation } from "../instance";

export const getSchedulesByEmployee = (venueId, idUser) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/list?venue_id=${venueId}&user_id=${idUser}`
  );
};

export const getEmployeesByVenue = (venueId) => {
  return axiosInstanceReservation.get(`employeeVenue/venue/${venueId}`);
};

export const getVenuesByEmployees = (venueId) => {
  return axiosInstanceReservation.get(`employeeVenue/user/${venueId}`);
};

export const getEmployeesAll = () => {
  return axiosInstanceReservation.get(`employeeVenue/all`);
};

export const postAddSchedulesEmployee = (data) => {
  return axiosInstanceReservation.post("scheduleEmployee", data);
};

export const putSchedulesEmployee = (data) => {
  return axiosInstanceReservation.put("scheduleEmployee", data);
};

export const deleteSchedulesEmployee = (userId, venueId) => {
  if (venueId === null) {
    return axiosInstanceReservation.delete(
      `employeeVenue/id_user/${userId}/id_venue/${venueId}?is_virtual=1`
    );
  }
  return axiosInstanceReservation.delete(
    `employeeVenue/id_user/${userId}/id_venue/${venueId}`
  );
};

export const postAddSchedulesVenue = (data) => {
  return axiosInstanceReservation.post("sheduleEmployee", data);
};

export const putUpdateEmployeeVenue = (data, uuid) => {
  return axiosInstanceReservation.put(`employeeVenue/uuid/${uuid}`, data);
};
