import { setData } from "./utils";

export const SET_NUTRITION = "nutrition/SET_NUTRITION";
export const SET_NUTRITION_DAYS = "nutrition/SET_NUTRITION_DAYS";

const initialState = {
  data: {},
  arrayDays: [],
};

const nutritionModule = (state = initialState, action) => {
  switch (action.type) {
    case SET_NUTRITION:
      return {
        ...state,
        data: action.payload,
      };

    case SET_NUTRITION_DAYS:
      return {
        ...state,
        arrayDays: action.payload,
      };

    default:
      return state;
  }
};

export const setNutrition = (data) => setData(SET_NUTRITION, data);
export const setNutrtionDays = (data) => setData(SET_NUTRITION_DAYS, data);

export default nutritionModule;
