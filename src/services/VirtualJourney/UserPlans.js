import { axiosInstance } from "../instance";
import axios from "axios";

export const getTrainingPlansByUser = (id) => {
  return axiosInstance.get(`training-plans/user/id/${id}`);
};

export const getNutritionalPlansByUser = (id) => {
  return axiosInstance.get(`nutritionalPlanUser/history/user/${id}`);
};

export const getUserPlans = function (userId) {
  return new Promise((resolve, reject) => {
    const requestOne = getTrainingPlansByUser(userId);
    const requestTwo = getNutritionalPlansByUser(userId);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const { data: trainingPlans } = responses[0];
          const { data: nutritionalPlans } = responses[1];

          resolve({ trainingPlans, nutritionalPlans });
        })
      )
      .catch((errors) => {
        reject(errors);
      });
  });
};
