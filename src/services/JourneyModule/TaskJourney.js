import { axiosInstance } from "../instance";

// Types task
export const getAllTypeTask = (data) => {
  return axiosInstance.get("task-types", data);
};

export const getAllTypeTaskById = (id) => {
  return axiosInstance.get(`task-types/${id}`);
};

export const getAllTypeTaskByUuid = (id) => {
  return axiosInstance.get(`task-types/uuid/${id}`);
};

export const postTypeTask = (data) => {
  return axiosInstance.post(`task-types`, data);
};

export const putTypeTask = (id, data) => {
  return axiosInstance.put(`task-types/uuid/${id}`, data);
};

export const deleteTypeTask = (id) => {
  return axiosInstance.delete(`task-types/uuid/${id}`);
};

// Steps Task

export const getAllTaskSteps = (data) => {
  return axiosInstance.get("task-steps", data);
};

export const getAllTaskStepsById = (id) => {
  return axiosInstance.get(`task-steps/${id}`);
};

export const getAllTaskStepsByUuid = (id) => {
  return axiosInstance.get(`task-steps/uuid/${id}`);
};

export const postTaskSteps = (data) => {
  return axiosInstance.post(`task-steps`, data);
};

export const putTaskSteps = (id, data) => {
  return axiosInstance.put(`task-steps/uuid/${id}`, data);
};

export const deleteTaskSteps = (id) => {
  return axiosInstance.delete(`task-steps/uuid/${id}`);
};
