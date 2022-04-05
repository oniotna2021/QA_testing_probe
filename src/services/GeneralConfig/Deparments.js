import { axiosInstanceGeneralConfig } from "../instance";

export const getAllDeparments = () => {
  return axiosInstanceGeneralConfig.get(`department`);
};

export const getDeparmentsByCountry = (id) => {
  return axiosInstanceGeneralConfig.get(`department/country/${id}`);
};

export const postDepartment = (data) => {
  return axiosInstanceGeneralConfig.post(`department`, data);
};

export const putDepartment = (data, id) => {
  return axiosInstanceGeneralConfig.put(`department/${id}`, data);
};

export const deleteDepartment = (id) => {
  return axiosInstanceGeneralConfig.delete(`department/${id}`);
};
