import { axiosInstance } from "../instance";

export const getAllCondition = (data) => {
  return axiosInstance.get("physicalCondition", data);
};

export const getConditionById = (id) => {
  return axiosInstance.get(`physicalCondition/${id}`);
};

export const postCondition = (data) => {
  return axiosInstance.post(`physicalCondition`, data);
};

export const putCondition = (id, data) => {
  return axiosInstance.put(`physicalCondition/id/${id}`, data);
};

export const deleteCondition = (id) => {
  return axiosInstance.delete(`physicalCondition/id/${id}`);
};
