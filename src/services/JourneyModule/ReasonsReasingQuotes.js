import { axiosInstanceReservation } from "../instance";

export const getAllReasons = (data) => {
  return axiosInstanceReservation.get("reasonScheduleChange", data);
};

export const getReasonsPagination = (data) => {
  return axiosInstanceReservation.get("reasonScheduleChange", data);
};

export const postReason = (data) => {
  return axiosInstanceReservation.post(`reasonScheduleChange`, data);
};

export const putReason = (uuid, data) => {
  return axiosInstanceReservation.put(
    `reasonScheduleChange/uuid/${uuid}`,
    data
  );
};

export const deleteReason = (uuid) => {
  return axiosInstanceReservation.delete(`reasonScheduleChange/uuid/${uuid}`);
};
