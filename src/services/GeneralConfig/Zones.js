import { axiosInstanceGeneralConfig } from "../instance";

export const getAllZones = (page = 1, limit = 50) => {
  return axiosInstanceGeneralConfig.get(`zone?page=${page}&limit=${limit}`);
};

export const getZoneByCityId = (cityId) => {
  return axiosInstanceGeneralConfig.get(`zone/city/${cityId}`);
};

export const postZone = (data) => {
  return axiosInstanceGeneralConfig.post(`zone`, data);
};

export const putZone = (data, id) => {
  return axiosInstanceGeneralConfig.put(`zone/${id}`, data);
};

export const deleteZone = (id) => {
  return axiosInstanceGeneralConfig.delete(`zone/${id}`);
};
