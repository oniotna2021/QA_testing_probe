import { setData } from "./utils";

// types
export const UPDATE_DAILY_FOOD = "medical/UPDATE_DAILY_FOOD";
export const UPDATE_FOOD_PREPARATION_TYPE =
  "medical/UPDATE_FOOD_PREPARATION_TYPE";
export const UPDATE_TERRITORIAL_ZONES = "medical/UPDATE_TERRITORIAL_ZONES";
export const UPDATE_RELATIONSHIP = "medical/UPDATE_RELATIONSHIP";
export const UPDATE_LINK_TYPES = "medical/UPDATE_LINK_TYPES";
export const UPDATE_TERRITORIAL_ENTITIES =
  "medical/UPDATE_TERRITORIAL_ENTITIES";
export const UPDATE_DISABILITY = "medical/UPDATE_DISABILITY";
export const UPDATE_PATHOLOGICAL_ANTECEDENTS =
  "medical/UPDATE_PATHOLOGICAL_ANTECEDENTS";
export const UPDATE_SURGERY_TIMES = "medical/UPDATE_SURGERY_TIMES";
export const UPDATE_MUSCULOSKELETAL_HISTORY =
  "medical/UPDATE_MUSCULOSKELETAL_HISTORY";
export const UPDATE_FAMILY_HISTORY = "medical/UPDATE_FAMILY_HISTORY";

export const UPDATE_TYPE_HEALTH_TECHNOLOGY =
  "medical/UPDATE_TYPE_HEALTH_TECHNOLOGY";
export const UPDATE_DIAGNOSTIC_TYPE = "medical/UPDATE_DIAGNOSTIC_TYPE";
export const UPDATE_MYCOACH_INTERVENTION =
  "medical/UPDATE_MYCOACH_INTERVENTION";
export const UPDATE_HEALTH_TECHNOLOGY = "medical/UPDATE_HEALTH_TECHNOLOGY";
export const UPDATE_HEALTH_EDUCATION = "medical/UPDATE_HEALTH_EDUCATION";
export const UPDATE_GOALS_INTERVENTION = "medical/UPDATE_GOALS_INTERVENTION";
export const UPDATE_METHOD = "medical/UPDATE_METHOD";
export const UPDATE_MODE_TYPE = "medical/UPDATE_MODE_TYPE";
export const UPDATE_SUPPLEMENTS = "medical/UPDATE_SUPPLEMENTS";
export const UPDATE_SLEEP_PATERN = "medical/UPDATE_SLEEP_PATERN";

//  create initial state medical
const initialState = {
  dailyFood: [],
  foodPreparationType: [],
  territorialZones: [],
  relationship: [],
  linkTypes: [],
  territorialEntities: [],
  disability: [],
  pathologicalAntecedents: [],
  surgeryTimes: [],
  musculoskeletalHistory: [],
  familyHistory: [],
  typeHealthTechnology: [],
  diagnosticType: [],
  nycoachIntervention: [],
  healthTechnology: [],
  healthEducation: [],
  goalsIntervention: [],
  method: [],
  modeType: [],
  supplements: [],
  sleepPatern: [],
};

// reducer
const globalInfoMedical = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DAILY_FOOD:
      return {
        ...state,
        dailyFood: action.payload,
      };
    case UPDATE_FOOD_PREPARATION_TYPE:
      return {
        ...state,
        foodPreparationType: action.payload,
      };
    case UPDATE_TERRITORIAL_ZONES:
      return {
        ...state,
        territorialZones: action.payload,
      };
    case UPDATE_RELATIONSHIP:
      return {
        ...state,
        relationship: action.payload,
      };
    case UPDATE_LINK_TYPES:
      return {
        ...state,
        linkTypes: action.payload,
      };
    case UPDATE_TERRITORIAL_ENTITIES:
      return {
        ...state,
        territorialEntities: action.payload,
      };
    case UPDATE_DISABILITY:
      return {
        ...state,
        disability: action.payload,
      };
    case UPDATE_PATHOLOGICAL_ANTECEDENTS:
      return {
        ...state,
        pathologicalAntecedents: action.payload,
      };
    case UPDATE_SURGERY_TIMES:
      return {
        ...state,
        surgeryTimes: action.payload,
      };
    case UPDATE_MUSCULOSKELETAL_HISTORY:
      return {
        ...state,
        musculoskeletalHistory: action.payload,
      };
    case UPDATE_FAMILY_HISTORY:
      return {
        ...state,
        familyHistory: action.payload,
      };
    case UPDATE_TYPE_HEALTH_TECHNOLOGY:
      return {
        ...state,
        typeHealthTechnology: action.payload,
      };
    case UPDATE_DIAGNOSTIC_TYPE:
      return {
        ...state,
        diagnosticType: action.payload,
      };
    case UPDATE_MYCOACH_INTERVENTION:
      return {
        ...state,
        myCoachIntervention: action.payload,
      };
    case UPDATE_HEALTH_TECHNOLOGY:
      return {
        ...state,
        healthTechnology: action.payload,
      };
    case UPDATE_HEALTH_EDUCATION:
      return {
        ...state,
        healthEducation: action.payload,
      };
    case UPDATE_GOALS_INTERVENTION:
      return {
        ...state,
        goalsIntervention: action.payload,
      };
    case UPDATE_METHOD:
      return {
        ...state,
        method: action.payload,
      };
    case UPDATE_MODE_TYPE:
      return {
        ...state,
        modeType: action.payload,
      };
    case UPDATE_SUPPLEMENTS:
      return {
        ...state,
        supplements: action.payload,
      };
    case UPDATE_SLEEP_PATERN:
      return {
        ...state,
        sleepPatern: action.payload,
      };
    default:
      return state;
  }
};

// functions
export const updateDailyFood = (payload) => setData(UPDATE_DAILY_FOOD, payload);

export const updateFoodPreparationType = (payload) =>
  setData(UPDATE_FOOD_PREPARATION_TYPE, payload);

export const updateTerritorialZones = (payload) =>
  setData(UPDATE_TERRITORIAL_ZONES, payload);

export const updateRelationship = (payload) =>
  setData(UPDATE_RELATIONSHIP, payload);

export const updateLinkTypes = (payload) => setData(UPDATE_LINK_TYPES, payload);

export const updateTerritorialEntities = (payload) =>
  setData(UPDATE_TERRITORIAL_ENTITIES, payload);

export const updateDisability = (payload) =>
  setData(UPDATE_DISABILITY, payload);

export const updatePathologicalAntecendents = (payload) =>
  setData(UPDATE_PATHOLOGICAL_ANTECEDENTS, payload);

export const updateSurgeryTimes = (payload) =>
  setData(UPDATE_SURGERY_TIMES, payload);

export const updateMusculoskeletalHistory = (payload) =>
  setData(UPDATE_MUSCULOSKELETAL_HISTORY, payload);

export const updateFamilyHistory = (payload) =>
  setData(UPDATE_FAMILY_HISTORY, payload);

export const updateTypeHealthTechnology = (payload) =>
  setData(UPDATE_TYPE_HEALTH_TECHNOLOGY, payload);

export const updateDiagnosticType = (payload) =>
  setData(UPDATE_DIAGNOSTIC_TYPE, payload);

export const updateMycoachIntervention = (payload) =>
  setData(UPDATE_MYCOACH_INTERVENTION, payload);

export const updateHealthTechnology = (payload) =>
  setData(UPDATE_HEALTH_TECHNOLOGY, payload);

export const updateHealthEducation = (payload) =>
  setData(UPDATE_HEALTH_EDUCATION, payload);

export const updateGoalsIntervention = (payload) =>
  setData(UPDATE_GOALS_INTERVENTION, payload);

export const updateMethod = (payload) => setData(UPDATE_METHOD, payload);

export const updateModeType = (payload) => setData(UPDATE_MODE_TYPE, payload);

export const updateSupplements = (payload) =>
  setData(UPDATE_SUPPLEMENTS, payload);

export const updateSleepPatern = (payload) =>
  setData(UPDATE_SLEEP_PATERN, payload);

export default globalInfoMedical;
