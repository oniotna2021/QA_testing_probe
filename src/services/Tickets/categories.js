import { axiosInstance } from "../instance";

export const getAllCategories = () => {
  return axiosInstance.get(`ticketCategory`);
};

export const getPaginateCategories = (page, limit) => {
  return axiosInstance.get(`ticketCategory/pag?limit=${limit}&page=${page}`);
};

export const postCategory = (data) => {
  return axiosInstance.post(`ticketCategory`, data);
};

export const putCategory = (data, uuid) => {
  return axiosInstance.put(`ticketCategory/uuid/${uuid}`, data);
};

export const deleteCategory = (uuid) => {
  return axiosInstance.delete(`ticketCategory/uuid/${uuid}`);
};
