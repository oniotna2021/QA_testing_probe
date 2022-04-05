import { axiosInstance } from "../instance";

export const getAllTypeTickets = () => {
  return axiosInstance.get(`ticketType`);
};

export const getPaginateTypeTickets = (page, limit) => {
  return axiosInstance.get(`ticketType/pag?limit=${limit}&page=${page}`);
};

export const postTypeTicket = (data) => {
  return axiosInstance.post(`ticketType`, data);
};

export const putTypeTicket = (data, uuid) => {
  return axiosInstance.put(`ticketType/uuid/${uuid}`, data);
};

export const deleteTypeTicket = (uuid) => {
  return axiosInstance.delete(`ticketType/uuid/${uuid}`);
};
