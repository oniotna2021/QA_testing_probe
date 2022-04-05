import { axiosInstanceReservation, axiosInstance } from "../instance";

export const getAllEmployees = () => {
  return axiosInstanceReservation.get(`employeeVenue/all`);
};

export const getAllEmployeesPag = (page, limit) => {
  return axiosInstanceReservation.get(
    `employeeVenue/employees?page=${page}&limit=${limit}`
  );
};

export const getDetailEmployeeById = (id) => {
  return axiosInstance.get(`users/user_id/${id}`);
};

export const getDetailEmployeeVenueById = (id) => {
  return axiosInstanceReservation.get(`employeeVenue/user/${id}`);
};

export const getEmployeesByVenue = (idVenue, dayWeek) => {
  return axiosInstanceReservation.get(`employeeVenue/venue/${idVenue}/day/${dayWeek}`);
};

export const getVenuesByEmployees = (idUser) => {
  return axiosInstanceReservation.get(`employeeVenue/user/${idUser}`);
};

export const postAddEmployeeVenue = (data) => {
  return axiosInstanceReservation.post("employeeVenue", data);
};

export const putUpdateEmployeeVenue = (data, uuid) => {
  return axiosInstanceReservation.put(`employeeVenue/uuid/${uuid}`, data);
};
