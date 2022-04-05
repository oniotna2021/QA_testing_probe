import { axiosInstance } from "../instance";

export const getAllCardiacDiseases = (data) => {
  return axiosInstance.get("CardiacDiseases", data);
};

export const getCardiacDiseasesbyID = (id) => {
  return axiosInstance.get(`CardiacDiseases/${id}`);
};

export const postCardiacDiseases = (data) => {
  return axiosInstance.post(`CardiacDiseases`, data);
};

export const putCardiacDiseases = (id, data) => {
  return axiosInstance.put(`CardiacDiseases/${id}`, data);
};

export const deleteCardiacDiseases = (id) => {
  return axiosInstance.delete(`CardiacDiseases/${id}`);
};
