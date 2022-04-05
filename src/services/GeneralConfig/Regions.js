import { axiosInstanceGeneralConfig } from "../instance";

export const getAllRegions = (page = 1, limit = 50) => {
  return axiosInstanceGeneralConfig.get(`region?page=${page}&limit=${limit}`);
};

export const getRegionsByCountryId = (countryId) => {
  return axiosInstanceGeneralConfig.get(`region/country/${countryId}`);
};

export const postRegion = (data) => {
  return axiosInstanceGeneralConfig.post(`region`, data);
};

export const putRegion = (data, id) => {
  return axiosInstanceGeneralConfig.put(`region/${id}`, data);
};

export const deleteRegion = (id) => {
  return axiosInstanceGeneralConfig.delete(`region/${id}`);
};
