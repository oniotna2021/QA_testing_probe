import { axiosInstanceReservation } from "../instance";

export const getQuotesMyCoachByUser = (user_id) => {
  return axiosInstanceReservation.get(
    `quotesMyCoachNutrition/getQuotesMyCoachByUser/460505`
  );
};
