import { axiosInstance } from "../instance";

export const getAllTrainingElements = (data) => {
  return axiosInstance.get("trainingElementsMyCoach", data);
};

export const getTrainingElementsById = (id) => {
  return axiosInstance.get(`trainingElementsMyCoach/id/${id}`);
};

export const postTrainingElements = (data) => {
  return axiosInstance.post(`trainingElementsMyCoach`, data);
};

export const putTrainingElements = (id, data) => {
  return axiosInstance.put(`trainingElementsMyCoach/id/${id}`, data);
};

export const deleteCardiacDiseases = (id) => {
  return axiosInstance.delete(`trainingElementsMyCoach/id/${id}`);
};
