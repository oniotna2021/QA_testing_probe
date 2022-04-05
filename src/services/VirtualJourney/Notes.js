import { axiosInstance } from "../instance";

export const postNote = (data) => {
  return axiosInstance.post(`quotesNotes`, data);
};
