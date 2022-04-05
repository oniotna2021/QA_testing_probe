import { axiosInstance } from "../instance";

export const getDailyFood = () => {
  return axiosInstance.get("dailyFood");
};

export const postDailyFood = (data) => {
  return axiosInstance.post("dailyFood", data);
};

export const putDailyFood = (id, data) => {
  return axiosInstance.put(`dailyFood/${id}`, data);
};

export const deleteDailyFood = (id) => {
  return axiosInstance.post(`dailyFood/delete/${id}`);
};

export const getDayWeek = () => {
  return axiosInstance.get("dayWeek");
};

export const orderDailyFoodElements = (data) => {
  return axiosInstance.put("dailyFood/position", data);
};
