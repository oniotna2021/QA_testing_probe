import { axiosInstanceReservation } from "../instance";

export const getLocationById = (id) => {
  return axiosInstanceReservation.get(`location/uuid/${id}`);
};

export const getVenuesByLocation = (idLocation) => {
  return axiosInstanceReservation.get(`location/${idLocation}/venue`);
};

export const getAllLocation = () => {
  return axiosInstanceReservation.get("location/all");
};

export const getLocationByName = (name) => {
  return axiosInstanceReservation.get(`location/name/${name}`);
};

export const getLocationByCategoryLocation = (name) => {
  return axiosInstanceReservation.get(`location/locationCategory/${name}`);
};

export const getLocationByVenue = (idVenue) => {
  return axiosInstanceReservation.get(`location/venue/${idVenue}`);
};

export const getLastCreatedAtLocation = ({ date }) => {
  return axiosInstanceReservation.get(`location/date/${date}`);
};

export const getLocationPagination = (limit, page) => {
  return axiosInstanceReservation.get(`location?limit=${limit}&page=${page}`);
};

export const postLocation = (data) => {
  return axiosInstanceReservation.post("location", data);
};

export const putLocation = (data, id) => {
  return axiosInstanceReservation.put(`location/uuid/${id}`, data);
};

export const deleteLocation = (id) => {
  return axiosInstanceReservation.delete(`location/uuid/${id}`);
};
