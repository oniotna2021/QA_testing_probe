import { setData } from './utils';

export const SET_FORM_DATA = 'trainingPlan/SET_FORM_DATA';
export const SET_EDITING_SESSION = 'trainingPlan/SET_EDITING_SESSION';
export const SET_INFO_PLAN = 'trainingPlan/SET_INFO_PLAN';
export const SET_SESSIONS_LIST = 'common/SET_SESSIONS_LIST';

export const RESET_SESSION_CREATE = 'common/RESET_SESSION_CREATE';
export const SET_SESSIONS_LIST_SELECTION = 'common/SET_SESSIONS_LIST_SELECTION';
export const ON_DELETE_SESSIONS_LIST_SELECTION = 'common/ON_DELETE_SESSIONS_LIST_SELECTION';
export const SET_SESSIONS_LIST_SELECTION_RESET = 'common/SET_SESSIONS_LIST_SELECTION_RESET';
export const SET_STEP = 'common/SET_STEP';

const initialState = {
    dataForm: {},
    dataSessionsInList: {},
    dataSessionsSelection: [],
    dataInfoForSessionCreate: {},
    step: 0,
    isEditingSession: false
}

const trainingPlanModule = (state = initialState, action) => {
    switch (action.type) {
        case SET_FORM_DATA:
            return {
                ...state,
                dataForm: action.payload
            }

        case SET_SESSIONS_LIST:
            return {
                ...state,
                dataSessionsInList: action.payload.dataSessionsInList,
                dataInfoForSessionCreate: action.payload.dataInfoForSessionCreate,
                step: 1,
            }



        case SET_INFO_PLAN:
            return {
                ...state,
                dataInfoForSessionCreate: action.payload.dataInfoForSessionCreate
            }


        case SET_EDITING_SESSION:
            return {
                ...state,
                isEditingSession: action.payload,
            }

        case RESET_SESSION_CREATE:
            return {
                ...state,
                dataSessionsInList: [],
                dataInfoForSessionCreate: [],
                step: 0,
                dataSessionsSelection: [],
                isEditingSession: false
            }


        case SET_SESSIONS_LIST_SELECTION:
            return {
                ...state,
                dataSessionsSelection: [...state.dataSessionsSelection, action.payload]
            }

        case SET_SESSIONS_LIST_SELECTION_RESET:
            return {
                ...state,
                dataSessionsSelection: action.payload
            }

        case ON_DELETE_SESSIONS_LIST_SELECTION:
            return {
                ...state,
                dataSessionsSelection: state.dataSessionsSelection.filter((item) => item.id !== action.payload.id)
            }

        case SET_STEP:
            return {
                ...state,
                step: action.payload.step
            }

        default:
            return state
    }
}

export const setInitFormTrainingPlan = (payload) => setData(SET_FORM_DATA, payload);
export const setInitFormDefaultValue = (payload) => setData(SET_INFO_PLAN, payload);
export const setSessionList = (payload) => setData(SET_SESSIONS_LIST, payload);
export const addSessionInSelection = (payload) => setData(SET_SESSIONS_LIST_SELECTION, payload);
export const onDeleteSessionInSelection = (payload) => setData(ON_DELETE_SESSIONS_LIST_SELECTION, payload);
export const onResetSessionInSelection = (payload) => setData(SET_SESSIONS_LIST_SELECTION_RESET, payload);
export const setStepForm = (payload) => setData(SET_STEP, payload);
export const setResetSessionCreate = (payload) => setData(RESET_SESSION_CREATE, payload);
export const setEditingSessionInPlan = (payload) => setData(SET_EDITING_SESSION, payload);

export default trainingPlanModule;