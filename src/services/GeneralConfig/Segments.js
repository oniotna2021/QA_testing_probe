import { axiosInstanceProducts } from "../instance";

export const postSegment = (data) => {
  return axiosInstanceProducts.post(`segment`, data);
};

export const putSegment = (data, id) => {
  return axiosInstanceProducts.put(`segment/id/${id}`, data);
};

export const deleteSegment = (id) => {
  return axiosInstanceProducts.delete(`segment/id/${id}`);
};

export const getAllSegments = () => {
  return axiosInstanceProducts.get(`segment/all`);
};
