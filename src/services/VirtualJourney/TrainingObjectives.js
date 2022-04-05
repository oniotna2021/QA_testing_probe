import { axiosInstance } from "../instance";

export const getTrainingObjectives = () => {
  return axiosInstance.get(`objective`);
};
