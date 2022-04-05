import { axiosInstanceGeneralConfig } from "../instance";

export const getAllCategories = () => {
  return axiosInstanceGeneralConfig.get("category-venue/all");
};

export const getCategoryByUUID = (id) => {
  return axiosInstanceGeneralConfig.get(`category-venue/uuid/${id}`);
};

export const getCategoryById = (id) => {
  return axiosInstanceGeneralConfig.get(`category-venue/id/${id}`);
};
