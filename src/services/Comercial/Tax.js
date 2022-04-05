import { axiosInstanceGeneralConfig } from "../instance";

export const postTax = (data) => {
  return axiosInstanceGeneralConfig.post(`taxes`, data);
};

export const putTax = (data, uuid) => {
  return axiosInstanceGeneralConfig.put(`taxes/up/${uuid}`, data);
};

export const deleteTax = (uuid) => {
  return axiosInstanceGeneralConfig.delete(`taxes/delete/${uuid}`);
};

export const getAllTaxes = () => {
  return axiosInstanceGeneralConfig.get(`taxes`);
};
