import { axiosInstance, axiosInstanceReservation } from "../instance";

export const getMedicalProfesional = (venue) => {
  return axiosInstance.get(`quotes/venue/${venue}`);
};

export const availabilityMedicalProfesional = (data, isVirtual) => {
  return axiosInstanceReservation.post("quotes/availability", data, {
    headers: {
      "X-Bodytech-Virtual-Option": isVirtual ? 1 : 0,
    },
  });
};

export const getMedicalProfesionalByVenueAndTypeAppointment = (venue, type) => {
  return axiosInstanceReservation.get(
    `quotes/venue_id/${venue}/appointment_type/${type}`
  );
};

export const getTypeAppointmentByMedical = (id) => {
  return axiosInstance.get(`medicalProfessional/user_id/${id}`);
};

export const getUsersByMedical = (id, page, limit) => {
  return axiosInstanceReservation.get(
    `quotes/medical_profesional/${id}?page=${page}&limit=${limit}`
  );
};

export const getUsersByMedicalPaginated = (id, page, limit) => {
  return axiosInstanceReservation.get(
    `quotesPatients/medical_profesional/${id}?limit=${limit}&page=${page}`
  );
};
