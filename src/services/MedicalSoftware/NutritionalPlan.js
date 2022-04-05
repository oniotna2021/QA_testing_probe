import { axiosInstance } from "../instance";

export const postNutritionalPlanModel = (data) => {
  return axiosInstance.post("nutritionalPlan/model", data);
};

export const postNutritionalPlanTemplate = (data, isCustomized) => {
  return axiosInstance.post(isCustomized ? `nutritionalPlan?customized` : 'nutritionalPlan', data);
};

export const putAssignNutritionPlanToUser = (data) => {
  return axiosInstance.put("nutritionalPlanUser/assignee", data);
};

export const deleteNutritionalRecipe = (data) => {
  return axiosInstance.post("nutritionalPlan/Recipe", data);
};

export const postNutritionalPlanToUser = (data) => {
  return axiosInstance.post("nutritionalPlan", data);
};

export const getDetailNutritionalPlanById = (id) => {
  return axiosInstance.get(`nutritionalPlan/getdetail/plan/${id}`);
};

export const getAllNutritionalPlansByUser = (id) => {
  return axiosInstance.get(`nutritionalPlanUser/history/user/${id}?page=1&limit=5`);
};

export const getNutritionalPlanByUser = (id) => {
  return axiosInstance.get(`nutritionalPlan/user/${id}`);
};

export const getNutritionalPlanById = (planId, userId) => {
  // optional user id
  return axiosInstance.get(
    `nutritionalPlan/get?nutritional_id=${planId}${
      userId && `&user_id=${userId}`
    }`
  );
};

export const getNutritionSuggestionByUser = (id) => {
  return axiosInstance.get(`customForm/nutritional-suggestions/${id}`);
};

export const putNutritionTemplateBase = (data) => {
  return axiosInstance.put("nutritionalPlan/template", data);
};


