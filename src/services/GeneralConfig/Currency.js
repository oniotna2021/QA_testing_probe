import { axiosInstanceGeneralConfig } from "../instance";

export const postCurrency = (data) => {
  return axiosInstanceGeneralConfig.post(`currency`, data);
};

export const putCurrency = (data, id) => {
  return axiosInstanceGeneralConfig.put(`currency/uuid/${id}`, data);
};

export const deleteCurrency = (id) => {
  return axiosInstanceGeneralConfig.delete(`currency/uuid/${id}`);
};

export const getAllCurrencies = () => {
  return axiosInstanceGeneralConfig.get(`currency`);
};

export const getCurrencyById = (id) => {
  return axiosInstanceGeneralConfig.get(`currency/${id}`);
};
