import { axiosInstance } from "../instance";

export const getMasterAutoCompleteSelect = (id) => {
  return axiosInstance.get(`/customDataSelect/table/${id}`);
};

export const postMasterAutoCompleteSelect = (data, id) => {
  return axiosInstance.post(`/customDataSelect/table/${id}`, data);
};

export const putMasterAutoCompleteSelect = (data, id) => {
  return axiosInstance.post(`/customDataSelect/table/${id}`, data);
};

export const deleteMasterAutoCompleteSelect = (id) => {
  return axiosInstance.post(`/customDataSelect/table/53/delete/${id}`);
};
