import { axiosInstanceProducts } from "../instance";

export const postPromotion = (data) => {
  return axiosInstanceProducts.post(`promotion`, data);
};

export const putPromotion = (data, id) => {
  return axiosInstanceProducts.put(`promotion/uuid/${id}`, data);
};

export const deletePromotion = (id) => {
  return axiosInstanceProducts.delete(`promotion/uuid/${id}`);
};

export const getAllPromotions = () => {
  return axiosInstanceProducts.get(`promotion`);
};

export const getPromotionByuuid = (id) => {
  return axiosInstanceProducts.get(`promotion/uuid/${id}`);
};

export const addProductsToPromotion = (data) => {
  return axiosInstanceProducts.post(`promotion/products/`, data);
};

export const editPromotionGrid = (data) => {
  return axiosInstanceProducts.put(`promotion/products/`, data);
};

export const getPromotionGridByuuid = (uuid) => {
  return axiosInstanceProducts.get(`promotion/grid/${uuid}`);
};
