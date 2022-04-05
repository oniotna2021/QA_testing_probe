import { axiosInstance } from "../instance";

export const getCardiacDiseases = (data) => {
  return axiosInstance.get(`CardiacDiseases`, data);
};
