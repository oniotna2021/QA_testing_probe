import { axiosInstanceGeneralConfig } from "../instance";

export const getAllLocalities = () => {
  return axiosInstanceGeneralConfig.get(`locality`);
};

export const getLocalityByCity = (idCity) => {
  return axiosInstanceGeneralConfig.get(`locality/city/${idCity}`);
};

export const addLocality = (data) => {
  return axiosInstanceGeneralConfig.post(`locality`, data);
};

export const updateLocality = (data, id) => {
  return axiosInstanceGeneralConfig.put(`locality/${id}`, data);
};

export const deleteLocality = (id) => {
  return axiosInstanceGeneralConfig.delete(`locality/${id}`);
};
