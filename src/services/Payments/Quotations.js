import { axiosInstancePayments } from "../instance";

export const getAllQuotations = () => {
  return axiosInstancePayments.get(`payments/quotation`);
};

export const getQuotationByuuid = (uuid) => {
  return axiosInstancePayments.get(`payments/quotation/${uuid}`);
};

export const postQuotation = (data) => {
  return axiosInstancePayments.post(`payments/quotation`, data);
};
