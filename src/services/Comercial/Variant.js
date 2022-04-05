import { axiosInstanceProducts } from "../instance";

export const postVariant = (data, id) => {
  return axiosInstanceProducts.post(`product/variant/${id}`, data);
};

export const getVariantsByProduct = (uuid) => {
  return axiosInstanceProducts.get(`product/variants/${uuid}`);
};
