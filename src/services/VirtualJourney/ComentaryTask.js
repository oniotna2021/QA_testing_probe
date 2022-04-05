import { axiosInstance } from "../instance";

export const addTaskComments = (data) => {
  return axiosInstance.post(`task-comments`, data);
};
