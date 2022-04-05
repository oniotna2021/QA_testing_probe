import { axiosInstanceReservation } from "../instance";

export const getAllReasons = () => {
  return axiosInstanceReservation.get("newsReason/all");
};

export const getAllReasonsByType = (type) => {
  return axiosInstanceReservation.get(`newsReason/news_type/${type}`);
};

export const getReasonsPag = (page, limit) => {
  return axiosInstanceReservation.get(
    `/newsReason?page=${page}&limit=${limit}`
  );
};

export const postReasonBlock = (data) => {
  return axiosInstanceReservation.post("newsReason", data);
};

export const putReasonBlock = (data, id) => {
  return axiosInstanceReservation.put(`newsReason/${id}`, data);
};

export const deleteReasonBlock = (id) => {
  return axiosInstanceReservation.delete(`newsReason/${id}`);
};
