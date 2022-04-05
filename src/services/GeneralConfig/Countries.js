import { axiosInstanceGeneralConfig } from "../instance";

export const postCountry = (data) => {
  return axiosInstanceGeneralConfig.post(`country`, data);
};

export const putCountry = (data, id) => {
  return axiosInstanceGeneralConfig.put(`country/uuid/${id}`, data);
};

export const deleteCountry = (id) => {
  return axiosInstanceGeneralConfig.delete(`country/uuid/${id}`);
};

export const getAllCountries = () => {
  return axiosInstanceGeneralConfig.get("country/all");
};

export const getCountryById = (id) => {
  return axiosInstanceGeneralConfig.get(`country/country_id/${id}`);
};
