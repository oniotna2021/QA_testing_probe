import { axiosInstanceGeneralConfig } from "../instance";

export const postDuration = (data) => {
  return axiosInstanceGeneralConfig.post(`duration`, data);
};

export const putDuration = (data, uuid) => {
  return axiosInstanceGeneralConfig.put(`duration/uuid/${uuid}`, data);
};

export const deleteDuration = (uuid) => {
  return axiosInstanceGeneralConfig.delete(`duration/uuid/${uuid}`);
};

export const getAllDurations = () => {
  return axiosInstanceGeneralConfig.get(`duration/all`);
};
