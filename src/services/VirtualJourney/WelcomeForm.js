import { axiosInstance } from "../instance";

export const postWelcomeForm = (data) => {
  return axiosInstance.post(`formWelcome/mycoach`, data);
};

export const postWelcomeFormNutrition = (data) => {
  return axiosInstance.post("formWelcome/mycoachnutrition", data);
};

export const getWelcomeFormByUser = (user_id) => {
  return axiosInstance.get(`formWelcome/user/${user_id}`);
};
