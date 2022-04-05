import { setData } from './utils';

export const SET_COUNTRIES = 'common/SET_COUNTRIES';
export const SET_STORE_DATA = 'common/SET_STORE_DATA';
export const SET_DATA_REUSABLE = 'common/SET_DATA_REUSABLE';
export const DATA_REUSABLE_NUTRICION = 'common/DATA_REUSABLE_NUTRICION';
export const SET_OPEN_DRAWER_PRIMARY = 'common/SET_OPEN_DRAWER_PRIMARY';
export const SET_TRAINING_STEPS = 'common/SET_TRAINING_STEPS';
export const EDIT_DIAGRAM_STEPS = 'common/EDIT_DIAGRAM_STEPS';

const initialState = {
  countries: [],
  openDrawerPrimary: true,
  storeData: {},
  trainingsElements: [],
  medicalConditions: [],
  trainingsLevels: [],
  goalsData: [],
  placesTraining: [],
  trainingSteps: [],
  trainingStepsSelected: [],
  goalsNutricion: [],
  typeAlimentation: [],
  timeAlimentation: []
}

const commonModule = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTRIES:
      return {
        ...state,
        countries: action.payload,
      }

    case SET_OPEN_DRAWER_PRIMARY:
      return {
        ...state,
        openDrawerPrimary: action.payload
      }

    case SET_DATA_REUSABLE:
      return {
        ...state,
        trainingsElements: action.payload[0],
        trainingsLevels: action.payload[1],
        medicalConditions: action.payload[2],
        goalsData: action.payload[3],
        placesTraining: action.payload[4]?.data,
        trainingSteps: action.payload[5]?.data
      }

    case DATA_REUSABLE_NUTRICION:
      return {
        ...state,
        goalsNutricion: action.payload[0],
        typeAlimentation: action.payload[1],
        timeAlimentation: action.payload[2]
      }

    case SET_STORE_DATA:
      return {
        ...state,
        storeData: action.payload,
      }

    case SET_TRAINING_STEPS:
      return {
        ...state,
        trainingStepsSelected: action.payload
      }

    case EDIT_DIAGRAM_STEPS:
      return {
        ...state,
        trainingStepsSelected: state.trainingStepsSelected.map((trainingStep) => {
          if (trainingStep._id === action.payload.idStep) {
            return {
              ...trainingStep, diagram: {
                ...trainingStep.diagram,
                elements: action.payload.elements
              }
            }
          }

          return trainingStep;
        })
      }
    default:
      return state
  }
}

export const setCountries = (countries) => setData(SET_COUNTRIES, countries);
export const setOpenDrawerPrimary = (payload) => setData(SET_OPEN_DRAWER_PRIMARY, payload);
export const setDataReusable = (payload) => setData(SET_DATA_REUSABLE, payload);
export const setDataReusableForNutricion = (payload) => setData(DATA_REUSABLE_NUTRICION, payload);
export const setStoreData = (store) => setData(SET_STORE_DATA, store);

export const reorderTrainingSteps = (payload) => dispatch => {
  dispatch({ type: SET_TRAINING_STEPS, payload: payload });
}

export const editDiagramTrainingStep = (id, elements) => dispatch => {
  dispatch({ type: EDIT_DIAGRAM_STEPS, payload: {  idStep: id, elements: elements } });
}


export default commonModule;
