import { axiosInstanceReservation } from "../instance";

export const getAllActivitiesReasons = () => {
  return axiosInstanceReservation.get(`NewReasonActivity`);
};

export const postActivityReason = (data) => {
  return axiosInstanceReservation.post(`NewReasonActivity`, data);
};

export const putActivityReason = (data, id) => {
  return axiosInstanceReservation.put(`NewReasonActivity/${id}`, data);
};

export const deleteActivityReason = (id) => {
  return axiosInstanceReservation.delete(`NewReasonActivity/${id}`);
};
