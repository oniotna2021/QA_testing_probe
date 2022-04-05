import { axiosInstance } from "../instance";

export const getAllObjetive = (data) => {
  return axiosInstance.get("objective", data);
};

export const postObjetive = (data) => {
  return axiosInstance.post(`objective`, data);
};

export const putObjetives = (id, data) => {
  return axiosInstance.put(`objective/id/${id}`, data);
};

export const deleteObjetives = (id) => {
  return axiosInstance.delete(`objective/id/${id}`);
};
