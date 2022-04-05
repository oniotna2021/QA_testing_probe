import { axiosInstanceReservation } from "../instance";

export const reserveInVenue = (data) => {
  return axiosInstanceReservation.post("customerReservation/inVenue", data);
};

export const getReserveInVenueByDate = (data) => {
  return axiosInstanceReservation.get(
    `customerReservation/availabel/${data.venueId}/${data.date}/${data.userId}`
  );
};

export const getDateReservation = (id_venue, date_real) => {
  return axiosInstanceReservation.get(
    `customerReservation/${id_venue}/${date_real}`
  );
};

export const getDataReservationAfiliate = (id_venue, date_real, hour) => {
  return axiosInstanceReservation.get(
    `customerReservation/detail/${id_venue}/${date_real}/${hour}`
  );
};

export const deleteReservationByUser = (idReservation) => {
  return axiosInstanceReservation.delete(
    `customerReservation/reserve/${idReservation}`
  );
};
