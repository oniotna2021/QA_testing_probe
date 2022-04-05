import { axiosInstance, axiosInstanceGeneralConfig } from "../instance";

export const getObservationsByUser = (id_user) => {
  return axiosInstance.get(`quoteObservation/last/${id_user}`);
};

export const postObservation = (data) => {
  return axiosInstance.post("quoteObservation", data);
};

export const getLastReasonsQueryByUser = (id) => {
  return axiosInstance.get(`reasonQuote/last/user/${id}`);
};

export const downloadPDFHistoryVitale = (user_id, vitale_id) => {
  return axiosInstance.get(
    `medicalHistory/user/${user_id}/hc_vitale_id/${vitale_id}`,
    {
      headers: {
        "Content-Type": "application/pdf",
      },
      responseType: "blob",
    }
  );
};

export const getListTypeClassGroup = () => {
  return axiosInstanceGeneralConfig.get(`activity/listTypeClassGroup`);
};
