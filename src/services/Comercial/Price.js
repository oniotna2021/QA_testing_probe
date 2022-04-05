import { axiosInstanceProducts } from "../instance";

export const postPrice = (data) => {
  return axiosInstanceProducts.post(`product-price/add`, data);
};

export const putPrice = (data, id) => {
  return axiosInstanceProducts.put(`product-price/uuid/${id}`, data);
};

export const deletePrice = (id) => {
  return axiosInstanceProducts.delete(`product-price/uuid/${id}`);
};

export const getAllPrices = () => {
  return axiosInstanceProducts.get(`product-price`);
};

export const getPriceByProduct = (id) => {
  return axiosInstanceProducts.get(`product-price/product_id/${id}
`);
};
