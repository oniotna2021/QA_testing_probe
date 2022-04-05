import { setData } from "./utils";

export const UPDATE_HOLIDAYS = "global/UPDATE_HOLIDAYS";
export const UPDATE_TYPE_DOCUMENTS = "global/UPDATE_TYPE_DOCUMENTS";
export const UPDATE_CITIES_BY_COUNTRY = "global/UPDATE_CITIES_BY_COUNTRY";
export const SET_COUNTRIES = "global/SET_COUNTRIES";
export const SET_TYPES_QUOTES = "global/SET_TYPES_QUOTES";
export const SET_STEPS_JOURNEY_USER = "global/SET_STEPS_JOURNEY_USER";
export const SET_REASONS_REASING = "global/SET_REASONS_REASING";

// create all general info here
const initialState = {
  holidays: [],
  typesDocuments: [],
  cities: [],
  countries: [],
  typeQuotes: [],
  stepsTaskUser: {},
  listReasons: [],
};

const globalInfoModule = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_HOLIDAYS:
      return {
        ...state,
        holidays: action.payload,
      };

    case UPDATE_TYPE_DOCUMENTS:
      return {
        ...state,
        typesDocuments: action.payload,
      };

    case UPDATE_CITIES_BY_COUNTRY:
      return {
        ...state,
        cities: action.payload,
      };

    case SET_COUNTRIES:
      return {
        ...state,
        countries: action.payload,
      };

    case SET_TYPES_QUOTES:
      return {
        ...state,
        typeQuotes: action.payload,
      };

    case SET_STEPS_JOURNEY_USER: {
      return {
        ...state,
        stepsTaskUser: action.payload,
      };
    }

    case SET_REASONS_REASING: {
      return {
        ...state,
        listReasons: action.payload,
      };
    }

    default:
      return state;
  }
};

export const updateHolidays = (payload) => setData(UPDATE_HOLIDAYS, payload);

export const updateTypesDocuments = (payload) =>
  setData(UPDATE_TYPE_DOCUMENTS, payload);

export const updateCities = (payload) =>
  setData(UPDATE_CITIES_BY_COUNTRY, payload);

export const setDataCountries = (payload) => setData(SET_COUNTRIES, payload);
export const setTypeQuotes = (payload) => setData(SET_TYPES_QUOTES, payload);
export const setStepsJourneyUser = (payload) =>
  setData(SET_STEPS_JOURNEY_USER, payload);
export const setReasonsReasing = (payload) =>
  setData(SET_REASONS_REASING, payload);

export default globalInfoModule;
