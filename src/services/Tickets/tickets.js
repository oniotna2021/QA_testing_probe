import { axiosInstance } from "../instance";

export const getAllTickets = () => {
  return axiosInstance.get(`ticket`);
};
