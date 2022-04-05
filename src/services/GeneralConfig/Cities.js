import { axiosInstanceGeneralConfig } from "../instance";

export const getAllCities = () => {
  return axiosInstanceGeneralConfig.get(`city/all`);
};

export const postCity = (data) => {
  return axiosInstanceGeneralConfig.post(`city`, data);
};

export const putCity = (data, uuid) => {
  return axiosInstanceGeneralConfig.put(`city/uuid/${uuid}`, data);
};

export const deleteCity = (uuid) => {
  return axiosInstanceGeneralConfig.delete(`city/uuid/${uuid}`);
};

export const getCitiesByDepartment = (id) => {
  return axiosInstanceGeneralConfig.get(`city/information?department=${id}`);
};
