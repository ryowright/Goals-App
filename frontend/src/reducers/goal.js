import {
    CREATE_GOAL_SUCCESS,
    CREATE_GOAL_FAIL,
    GET_ALL_SUCCESS,
    GET_ALL_FAIL,
    FLIP_SUBMIT,
    GET_ONE_SUCCESS,
    GET_ONE_FAIL,
    UPDATE_GOAL_SUCCESS,
    UPDATE_GOAL_FAIL,
    DELETE_GOAL_SUCCESS,
    DELETE_GOAL_FAIL
} from '../actions/types';

const initialState = {
    goals: [],
    error: null,
    submitSuccess: false,
}

export default function goal(state = initialState, action) {
    switch(action.type) {
        case GET_ALL_SUCCESS:
            return {
                ...state,
                error: null,
                goals: action.payload,
            };
        case GET_ALL_FAIL:
            return {
                ...state,
            };
        case CREATE_GOAL_SUCCESS:
            return {
                ...state,
                goals: [...state.goals, action.payload],
                error: null,
                submitSuccess: true,
            };
        case CREATE_GOAL_FAIL:
            return {
                ...state,
                error: action.error,
                submitSuccess: false,
            };
        case UPDATE_GOAL_SUCCESS:
            return {
                ...state,
                goals: [
                    ...state.goals.filter((goal) => goal._id !== action._id),
                    action.payload.updatedGoal
                ],
                error: null,
                submitSuccess: true,
            };
        case UPDATE_GOAL_FAIL:
            return {
                ...state,
                error: action.error,
                submitSuccess: false,
            };
        case DELETE_GOAL_SUCCESS:
            return {
                ...state,
                goals: state.goals.filter((goal) => goal._id !== action.payload.deletedGoal._id),
                error: null,
            };
        case DELETE_GOAL_FAIL:
            return {
                ...state,
                error: action.error,
            };
        case FLIP_SUBMIT:
            return {
                ...state,
                submitSuccess: false,
            };
        
        default:
            return state;
    }
}