import { axiosInstanceGeneralConfig } from "../instance";

export const getAllCompanies = () => {
  return axiosInstanceGeneralConfig.get(`company`);
};

export const getAllCompaniesByOrganization = () => {
  return axiosInstanceGeneralConfig.get(`company/headers`);
};

export const getCommpanyByuuid = (uuid) => {
  return axiosInstanceGeneralConfig.get(`company/uuid/${uuid}`);
};

export const postCompany = (data) => {
  return axiosInstanceGeneralConfig.post(`company`, data);
};

export const putCompany = (data, uuid) => {
  return axiosInstanceGeneralConfig.put(`company/uuid/${uuid}`, data);
};

export const deleteCompany = (uuid) => {
  return axiosInstanceGeneralConfig.delete(`company/uuid/${uuid}`);
};
