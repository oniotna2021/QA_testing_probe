import { axiosInstance } from "../instance";

export const getAllTicketSeverity = () => {
  return axiosInstance.get(`ticketSeverity`);
};

export const getPaginateTicketSeverity = (page, limit) => {
  return axiosInstance.get(`ticketSeverity/pag?limit=${limit}&page=${page}`);
};

export const postTicketSeverity = (data) => {
  return axiosInstance.post(`ticketSeverity`, data);
};

export const putTicketSeverity = (data, uuid) => {
  return axiosInstance.put(`ticketSeverity/uuid/${uuid}`, data);
};

export const deleteTicketSeverity = (uuid) => {
  return axiosInstance.delete(`ticketSeverity/uuid/${uuid}`);
};
