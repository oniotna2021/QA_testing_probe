import { axiosInstance } from "../instance";

export const getFormPDF = (quote_id) => {
  return axiosInstance.get(`formWelcome/pdf/${quote_id}`, {
    headers: {
      "Content-Type": "application/pdf",
    },
    responseType: "blob",
  });
};
