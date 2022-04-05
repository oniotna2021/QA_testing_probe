import { axiosInstance } from "../instance";

export const getTypeTask = () => {
  return axiosInstance.get(`task-types`);
};

export const postTypeTask = () => {
  return axiosInstance.post(`task-types`, { name: "Llamada a cliente" });
};
