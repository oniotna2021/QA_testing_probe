import { setData } from "./utils";

export const UPDATE_WELCOME_FORM = "virtualJourney/UPDATE_WELCOME_FORM";

const initialState = {
  welcomeForm: {},
};

const promotionsModule = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_WELCOME_FORM:
      return {
        ...state,
        welcomeForm: action.payload,
      };

    default:
      return state;
  }
};

export const updateWelcomeForm = (payload) =>
  setData(UPDATE_WELCOME_FORM, payload);

export default promotionsModule;
