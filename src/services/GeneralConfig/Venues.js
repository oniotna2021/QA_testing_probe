import { axiosInstanceGeneralConfig } from "../instance";

export const getAllVenues = () => {
  return axiosInstanceGeneralConfig.get(`venue/all`);
};

export const getVenuesByCity = (id) => {
  return axiosInstanceGeneralConfig.get(`venue/city/${id}`);
};

export const getVenuesByCategories = (categoriesArray) => {
  return axiosInstanceGeneralConfig.get(
    `venue/category?ids=[${categoriesArray}]`
  );
};
