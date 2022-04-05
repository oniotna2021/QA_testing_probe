import { axiosInstance } from "../instance";

export const getRoleById = (id) => {
  return axiosInstance.get(`roles/${id}`);
};

export const getRoles = (administrative) => {
  if (administrative) {
    return axiosInstance.get(`roles?administrative=${0}`);
  }
  return axiosInstance.get(`roles`);
};

export const postRole = (data) => {
  return axiosInstance.post("roles", data);
};

export const putRole = (data, id) => {
  return axiosInstance.put(`roles/${id}`, data);
};

export const deleteRole = (id) => {
  return axiosInstance.post(`roles/delete/${id}`);
};
