import { axiosInstance } from "../instance";

export const getPhysicalConditions = () => {
  return axiosInstance.get(`physicalCondition`);
};
