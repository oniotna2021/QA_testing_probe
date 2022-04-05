import { axiosInstance } from "../instance";

export const getVirtualTrainingElements = () => {
  return axiosInstance.get(`trainingElementsMyCoach`);
};
