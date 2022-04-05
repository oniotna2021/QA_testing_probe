import { setData } from './utils';

export const SET_INIT_FORM = 'sessions/SET_INIT_FORM';
export const SET_STEP_FORM = 'sessions/SET_STEP_FORM';
export const SET_EXERCISE_ADD = 'sessions/SET_EXERCISE_ADD';
export const RESET_CRETING_SESSION = 'sessions/RESET_CRETING_SESSION';
export const REMOVE_EXERCISE_IN_DIAGRAM_FLOW = 'sessions/REMOVE_EXERCISE_IN_DIAGRAM_FLOW';
export const SET_STEP_OPTION = 'sessions/SET_STEP_OPTION';


const initialState = {
    formValues: {},
    training_step_id: 0,
    training_step_id_selected: 0,
    training_step_name: '',
    nameStep: 'init',
    exercisesAdd: {},
    nodesAdd: [],
    typeTraining: ''
}

const sessionsModule = (state = initialState, action) => {

    switch (action.type) {
        case SET_INIT_FORM:
            return {
                ...state,
                formValues: action.payload
            }


        case SET_STEP_OPTION:
            return {
                ...state,
                training_step_id: action.payload.training_step?._id || 3,
                training_step_id_selected: action.payload.training_step?.id || 3,
                training_step_name: action.payload.training_step?.name || ''
            }

        case SET_EXERCISE_ADD:
            return {
                ...state,
                exercisesAdd: action.payload
            }



        case REMOVE_EXERCISE_IN_DIAGRAM_FLOW:
            return {
                ...state,
                exercisesAdd: {}
            }



        case RESET_CRETING_SESSION:
            return {
                ...state,
                formValues: '',
                nodesAdd: [],
                exercisesAdd: {},
                nameStep: 'init'
            }

        case SET_STEP_FORM:
            return {
                ...state,
                nameStep: action.payload.nameStep
            }

        default:
            return state
    }
}

export const setInitsForm = (payload) => setData(SET_INIT_FORM, payload);
export const setStepForm = (payload) => setData(SET_STEP_FORM, payload);
export const setStepOption = (payload) => setData(SET_STEP_OPTION, payload);
export const removeExercices = (payload) => setData(REMOVE_EXERCISE_IN_DIAGRAM_FLOW, payload);
export const addExercises = (payload) => setData(SET_EXERCISE_ADD, payload);
export const resetCreateSession = (payload) => setData(RESET_CRETING_SESSION, payload);

export default sessionsModule;

