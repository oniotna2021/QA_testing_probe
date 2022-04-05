import { axiosInstance } from "../instance";

export const getGroupModuleById = (id) => {
  return axiosInstance.get(`module-groups/${id}`);
};

export const getGroupModules = () => {
  return axiosInstance.get("module-groups?page=1&limit=50");
};

export const postGroupModule = (data) => {
  return axiosInstance.post("module-groups", data);
};

export const putGroupModule = (data, id) => {
  return axiosInstance.put(`module-groups/${id}`, data);
};

export const deleteGroupModule = (id) => {
  return axiosInstance.post(`module-groups/delete/${id}`);
};
