import { axiosInstance } from "../instance";

export const getAllChanels = () => {
  return axiosInstance.get(`ticketChanel`);
};

export const getPaginateChanels = (page, limit) => {
  return axiosInstance.get(`ticketChanel/pag?limit=${limit}&page=${page}`);
};

export const postChanel = (data) => {
  return axiosInstance.post(`ticketChanel`, data);
};

export const putChanel = (data, uuid) => {
  return axiosInstance.put(`ticketChanel/uuid/${uuid}`, data);
};

export const deleteChanel = (uuid) => {
  return axiosInstance.delete(`ticketChanel/uuid/${uuid}`);
};
