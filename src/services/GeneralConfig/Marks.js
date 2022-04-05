import { axiosInstanceGeneralConfig } from "../instance";

export const getAllMarks = () => {
    return axiosInstanceGeneralConfig.get(`brand`);
};

export const postMark = (data) => {
    return axiosInstanceGeneralConfig.post(`brand`, data);
};

export const putMark = (data, uuid) => {
    return axiosInstanceGeneralConfig.put(`brand/uuid/${uuid}`, data);
};

export const deleteMark = (uuid) => {
    return axiosInstanceGeneralConfig.delete(`brand/uuid/${uuid}`);
};
