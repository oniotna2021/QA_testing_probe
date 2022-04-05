import { axiosInstance } from "../instance";

export const getPhysicalValuationByUser = (user_id) => {
  return axiosInstance.get(`physicalEvaluation/user/${user_id}`);
};
