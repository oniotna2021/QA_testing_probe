import { axiosInstanceReservation, axiosInstance } from "../instance";

export const getAfiliatesByUser = (user_id) => {
  return axiosInstanceReservation.get(
    `quotesMyCoachNutrition/getAffiliatesbyUser/${user_id}`
  );
};

export const getPlansByUser = (user_id) => {
  return axiosInstance.get(`flow-process/virtual/products?user_id=${user_id}`);
};

export const getLastDateBodyCompositionAnalysis = (id) => {
  return axiosInstance.get(`formWelcome/last/user/${id}`);
};

export const postLastWelcomeFormFromClient = (data) => {
  return axiosInstance.post("formWelcome/registerQuote", data);
};

// carterizacion
export const getMembersControlTower = (
  plan_status,
  with_trainer,
  number_document,
  limit,
  page
) => {
  return axiosInstance.get(
    `carterization/getMembersControlTower?plan_status=${plan_status}&with_trainer=${with_trainer}&number_document=${number_document}&limit=${limit}&page=${page}`
  );
};

export const getMembersByUser = (
  plan_status,
  with_plan,
  number_document,
  user_id,
  limit,
  page
) => {
  return axiosInstance.get(
    `carterization/getMembersByUser?plan_status=${plan_status}&with_plan=${with_plan}&number_document=${number_document}&user_id=${user_id}&limit=${limit}&page=${page}`
  );
};

export const postCarterization = (data) => {
  return axiosInstance.post(`carterization`, data);
};

export const putCarterization = (data) => {
  return axiosInstance.put(`carterization/`, data);
};
