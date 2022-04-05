import { axiosInstanceProducts } from "../instance";

export const postChannel = (data) => {
  return axiosInstanceProducts.post(`channel`, data);
};

export const putChannel = (data, id) => {
  return axiosInstanceProducts.put(`channel/id/${id}`, data);
};

export const deleteChannel = (id) => {
  return axiosInstanceProducts.delete(`channel/id/${id}`);
};

export const getAllChannels = () => {
  return axiosInstanceProducts.get(`channel`);
};
