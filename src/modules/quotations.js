import { setData } from "./utils";

export const UPDATE_PRODUCTS = "quotations/UPDATE_PRODUCTS";

const initialState = {
  selectedProducts: [],
};

const quotationsModule = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PRODUCTS:
      return {
        selectedProducts: action.payload,
      };

    default:
      return state;
  }
};

export const updateSelectedProducts = (payload) =>
  setData(UPDATE_PRODUCTS, payload);

export default quotationsModule;
