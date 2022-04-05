import {
  axiosInstanceGeneralConfig,
  axiosInstanceReservation,
} from "../instance";

export const getActivitiesById = (id) => {
  return axiosInstanceGeneralConfig.get(`activity/uuid/${id}`);
};

export const getActivityById = (id) => {
  return axiosInstanceReservation.get(
    `scheduleActivity/locationActivity/${id}`
  );
};

export const getAllActivities = () => {
  return axiosInstanceGeneralConfig.get("activity/all");
};

export const getActivitiesPagination = (limit, page) => {
  return axiosInstanceGeneralConfig.get(`activity?limit=${limit}&page=${page}`);
};

export const postActivity = (data) => {
  return axiosInstanceGeneralConfig.post("activity", data);
};

export const putActivity = (data, id) => {
  return axiosInstanceGeneralConfig.post(`activity/uuid/${id}`, data);
};

export const deleteActivity = (id) => {
  return axiosInstanceGeneralConfig.delete(`activity/uuid/${id}`);
};

export const deleteActivityFormActivity = (id) => {
  return axiosInstanceReservation.post(`scheduleGroupLessons/delete/${id}`)
}

export const getCustomizedActivities = () => {
  return axiosInstanceGeneralConfig.get("activity/type_activity_id/8");
};

export const getProductActivities = () => {
  return axiosInstanceGeneralConfig.get(
    "activity/activities-only-unique/filter_by/product"
  );
};
