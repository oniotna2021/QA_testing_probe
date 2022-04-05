import { axiosInstanceReservation } from "../instance";

export const getActivitiesGeneralByDate = (date, venueId, profileId) => {
  return axiosInstanceReservation.get(
    `scheduleEmployee/activitiesDate?date=${date}&venue_id=${venueId}&profile_id=${profileId}`
  );
};

export const postAssignMassiveActivity = (data) => {
  return axiosInstanceReservation.post("scheduleActivity/masiveAdd", data);
};
