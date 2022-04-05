import { axiosInstanceReservation } from "../instance";

export const getUSDownload = (value) => {
  return axiosInstanceReservation.get(
    `quotesReports/infoUS?city_id=${value.venue.id}&year=${value.year}&month=${value.month}`
  );
};

export const getAFDownload = (value) => {
  return axiosInstanceReservation.get(
    `quotesReports/infoAF?city_id=${value.venue.id}&year=${value.year}&month=${value.month}&invoice_consecutive=${value.invoice_consecutive}`
  );
};

export const getACDownload = (value) => {
  return axiosInstanceReservation.get(
    `quotesReports/infoAC?city_id=${value.venue.id}&year=${value.year}&month=${value.month}&invoice_consecutive=${value.invoice_consecutive}`
  );
};
