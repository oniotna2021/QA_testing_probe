import { setData } from "./utils";

export const UPDATE_PRODUCTS = "promotions/UPDATE_PRODUCTS";
export const UPDATE_PROMOTIONS = "promotions/UPDATE_PROMOTIONS";
export const UPDATE_CATEGORIES = "promotions/UPDATE_CATEGORIES";
export const RESET_GRID = "promotions/RESET_GRID";

const initialState = {
  selectedProducts: [],
  selectedPromotions: [],
  selectedCategories: [],
};

const promotionsModule = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PRODUCTS:
      return {
        ...state,
        selectedProducts: action.payload,
      };

    case UPDATE_PROMOTIONS:
      return {
        ...state,
        selectedPromotions: action.payload,
      };

    case UPDATE_CATEGORIES:
      return {
        ...state,
        selectedCategories: action.payload,
      };

    case RESET_GRID:
      return {
        ...state,
        selectedProducts: [],
        selectedPromotions: [],
        selectedCategories: [],
      };

    default:
      return state;
  }
};

export const updateSelectedProducts = (payload) =>
  setData(UPDATE_PRODUCTS, payload);

export const updateSelectedPromotions = (payload) =>
  setData(UPDATE_PROMOTIONS, payload);

export const updateSelectedCategories = (payload) =>
  setData(UPDATE_CATEGORIES, payload);

export const resetGrid = () => setData(RESET_GRID);

export default promotionsModule;
