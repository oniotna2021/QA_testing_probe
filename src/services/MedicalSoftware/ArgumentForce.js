import { axiosInstanceReservation } from "../instance";

export const getAllArgumentForce = () => {
  return axiosInstanceReservation.get("argumentForceQuote");
};

export const postArgumentForce = (data) => {
  return axiosInstanceReservation.post("argumentForceQuote", data);
};

export const putArgumentForce = (data, id ) => {
  return axiosInstanceReservation.put(`argumentForceQuote/${id}`, data);
};

export const deleteArgumentForce = (id) => {
  return axiosInstanceReservation.delete(`argumentForceQuote/${id}`);
};
