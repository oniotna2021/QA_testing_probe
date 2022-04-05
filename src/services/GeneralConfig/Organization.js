import { axiosInstanceGeneralConfig } from "../instance";

export const getAllOrganizations = () => {
  return axiosInstanceGeneralConfig.get(`organization`);
};

export const postOrganization = (data) => {
  return axiosInstanceGeneralConfig.post(`organization`, data);
};

export const putOrganization = (data, uuid) => {
  return axiosInstanceGeneralConfig.put(`organization/uuid/${uuid}`, data);
};

export const deleteOrganization = (uuid) => {
  return axiosInstanceGeneralConfig.delete(`organization/uuid/${uuid}`);
};
