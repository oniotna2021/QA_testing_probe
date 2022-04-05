import { axiosInstanceGeneralConfig } from "../instance";

export const getAllBrandsByCompanies = (companies) => {
  return axiosInstanceGeneralConfig.get(
    `brand/companies?companies=[${companies}]`
  );
};

export const getAllBrands = () => {
  return axiosInstanceGeneralConfig.get(`brand/all`);
};
