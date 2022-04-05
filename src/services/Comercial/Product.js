import { axiosInstanceProducts } from "../instance";

export const postProduct = (data) => {
  return axiosInstanceProducts.post(`product/add`, data);
};


export const initBudget = (data) => {
  return axiosInstanceProducts.post(`budget`, data);
};

export const putProduct = (data, id) => {
  return axiosInstanceProducts.put(`product/uuid/${id}`, data);
};

export const deleteProduct = (id) => {
  return axiosInstanceProducts.delete(`product/uuid/${id}`);
};

export const searchProduct = (value) => {
  return axiosInstanceProducts.post(`product/search-produts`, value);
};

export const getAllProducts = (limit, page) => {
  return axiosInstanceProducts.get(`product/?limit=${limit}&page=${page}`);
};

export const getProductById = (id) => {
  return axiosInstanceProducts.get(`product/uuid/${id}`);
};

export const getProductByuuId = (uuid) => {
  return axiosInstanceProducts.get(`product/uuid/${uuid}`);
};
