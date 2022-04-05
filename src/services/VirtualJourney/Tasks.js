import { axiosInstance } from "../instance";

export const getTaskByDateRange = (startDate, endDate) => {
  return axiosInstance.get(
    `tasks/by-date-range?startDate=${startDate}&endDate=${endDate}`
  );
};

export const getTaskByDate = (date) => {
  return axiosInstance.get(`tasks/by-date?date=${date}`);
};

export const getTaskById = (id) => {
  return axiosInstance.get(`tasks/${id}`);
};

export const getTaskByUUID = (uuid) => {
  return axiosInstance.get(`tasks/uuid/${uuid}`);
};

export const postTask = (data) => {
  return axiosInstance.post(`tasks`, data);
};

export const updateTask = (data, uuid) => {
  return axiosInstance.put(`tasks/uuid/${uuid}`, data);
};

export const deleteTaskByUUID = (uuid) => {
  return axiosInstance.delete(`tasks/uuid/${uuid}`);
};

export const getTaskSteps = () => {
  return axiosInstance.get(`/task-steps`);
};

export const getTaskStepsByUser = (userId) => {
  return axiosInstance.get(`/task-steps/user_id/${userId}`);
};
