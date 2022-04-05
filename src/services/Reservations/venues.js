import { axiosInstanceGeneralConfig } from "../instance";

export const getVenueById = (id) => {
  return axiosInstanceGeneralConfig.get(`venue/uuid/${id}`);
};

export const getVenueByUUID = (id) => {
  return axiosInstanceGeneralConfig.get(`venue/uuid/${id}`);
};

export const getVenuesByCity = (idCity, brands) => {
  if (brands) {
    const mapBrands = brands.map((p) => p.id).join(",");
    return axiosInstanceGeneralConfig.get(
      `venue/city/${idCity}?brands_ids=${mapBrands}`
    );
  }
  return axiosInstanceGeneralConfig.get(`venue/city/${idCity}`);
};

export const getAllVenues = () => {
  return axiosInstanceGeneralConfig.get("venue/all");
};

export const getVenuesByIds = (idsVenue) => {
  return axiosInstanceGeneralConfig.get(`venue/list?venues=${idsVenue}`);
};

export const getVenuesPagination = (limit, page, name) => {
  if (name.trim().length > 0) {
    return axiosInstanceGeneralConfig.get(
      `venue?limit=${limit}&page=${page}&name=${name}`
    );
  } else {
    return axiosInstanceGeneralConfig.get(`venue?limit=${limit}&page=${page}`);
  }
};

export const postVenue = (data) => {
  return axiosInstanceGeneralConfig.post("venue", data);
};

export const putVenue = (data, id) => {
  return axiosInstanceGeneralConfig.post(`venue/uuid/${id}`, data);
};

export const deleteVenue = (id) => {
  return axiosInstanceGeneralConfig.delete(`venue/uuid/${id}`);
};
