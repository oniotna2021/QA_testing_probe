import { axiosInstance, axiosInstanceReservation } from "./instance";

const searchAfiliatesService = (value) => {
  return axiosInstance.get(`users/search/${value}`);
};

const getAfiliateForId = (id) => {
  return axiosInstance.get(`users/id/${id}`);
};

const getNewAfiliatesWithoutPlan = (venue_id) => {
  return axiosInstance.get(`users/newNoTrainingPlanByVenue/${venue_id}`);
};

const getLogsIdUserActions = (idAfiliate) => {
  return axiosInstance.get(`mobile-logs/user-actions/${idAfiliate}`);
};

const getLogAccessAfiliateForId = (id) => {
  return axiosInstance.get(`mobile-logs/access-control/${id}`);
};

const getTrainingPlansByUser = (id) => {
  return axiosInstance.get(`training-plans/user/id/${id}`);
};

const getCountUsersPlanParams = (id) => {
  return axiosInstance.get(`trainers/sumary/${id}`);
};

const getMedicalSuggestionByUserHistory = (idAfiliate) => {
  return axiosInstance.get(`medicalSuggestions/${idAfiliate}?page=1&limit=100`);
};

const getPhysicalByUserHistory = (idAfiliate) => {
  return axiosInstance.get(
    `physicalEvaluation/all/user/${idAfiliate}?page=1&limit=100`
  );
};

const getQuotesByUserHistory = (idAfiliate) => {
  return axiosInstanceReservation.get(
    `quotes/user/${idAfiliate}?page=1&limit=100`
  );
};

const getHistoryByQuoteAffiliate = (idQuote) => {
  return axiosInstanceReservation.get(
    `quotesMyCoachNutrition/getDetailQuotesMyCoach/${idQuote}`
  );
};

const postCallQuoteAffiliate = (data) => {
  return axiosInstanceReservation.post(`quotesMyCoachNutrition/call`, data);
};

const getTrainingsPlanHistoryForIdUser = (idAfiliate) => {
  return axiosInstance.get(`training-plans/historical/${idAfiliate}`);
};

const getUsersForTrainer = (value) => {
  return axiosInstance.get(`users/trainer/${value}`);
};

const getUsersForTrainerWithFilters = (id_trainer, params) => {
  return axiosInstance.get(`trainers/${id_trainer}/all-users?${params}`);
};

const getUsersForTrainerWaitingSinPlan = (trainer) => {
  return axiosInstance.get(`users/waiting-plan/trainer/${trainer}`);
};

const getUsersForTrainerWaitingNutritionPlan = () => {
  return axiosInstance.get(`users/waiting-nutritional-plan`);
};

const getUsersWithoutForTrainer = (venue) => {
  return axiosInstance.get(`users/venue/${venue}`);
};

const createUserLead = (data) => {
  return axiosInstance.post(`authentication/userLead`, data);
};

const getLastBodyCompositionAnalysis = (id) => {
  return axiosInstance.get(`physicalEvaluation/last/user_id/${id}`);
};

const postFileAssignationUsersToTrainers = (data) => {
  return axiosInstance.post("image-recipe", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getDetailLogSession = (id, user_id, page, limit) => {
  return axiosInstance.get(
    `mobile-logs/user-session-actions/${user_id}/${id}?page=${page}&limit=${limit}`
  );
};

export {
  searchAfiliatesService,
  getUsersForTrainer,
  getUsersForTrainerWaitingSinPlan,
  getUsersWithoutForTrainer,
  getAfiliateForId,
  getLogsIdUserActions,
  getTrainingsPlanHistoryForIdUser,
  getMedicalSuggestionByUserHistory,
  getPhysicalByUserHistory,
  getQuotesByUserHistory,
  createUserLead,
  getTrainingPlansByUser,
  getUsersForTrainerWaitingNutritionPlan,
  getUsersForTrainerWithFilters,
  getCountUsersPlanParams,
  postFileAssignationUsersToTrainers,
  getLastBodyCompositionAnalysis,
  getNewAfiliatesWithoutPlan,
  getLogAccessAfiliateForId,
  getDetailLogSession,
  getHistoryByQuoteAffiliate,
  postCallQuoteAffiliate,
};
