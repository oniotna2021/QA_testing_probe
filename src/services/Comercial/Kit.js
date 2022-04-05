import { axiosInstanceProducts } from "../instance";

export const postKit = (data) => {
  return axiosInstanceProducts.post(`product/add-kit`, data);
};
