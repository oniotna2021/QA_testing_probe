import { axiosInstance, axiosInstanceReservation } from "../instance";

export const getAppointments = () => {
  return axiosInstanceReservation.get("quotes");
};

export const postAppointment = (data, isVirtual) => {
  return axiosInstanceReservation.post("quotes", data, {
    headers: {
      "X-Bodytech-Virtual-Option": isVirtual ? 1 : 0,
    },
  });
};

export const deleteAppointment = (id) => {
  return axiosInstanceReservation.post(`quotes/appointment/${id}`);
};

export const addNextDateAppointment = (data) => {
  return axiosInstanceReservation.post(`quotes/addAnexo`, data);
};

export const postAppointmentAttachment = (data) => {
  return axiosInstance.post("appointment-attachments", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
