import { axiosInstanceProducts } from "../instance";

export const getAllRules = () => {
  return axiosInstanceProducts.get(`rules-type`);
};
