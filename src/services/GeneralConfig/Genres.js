import { axiosInstanceGeneralConfig } from "../instance";

export const getAllGenres = () => {
  return axiosInstanceGeneralConfig.get(`genre/all`);
};
