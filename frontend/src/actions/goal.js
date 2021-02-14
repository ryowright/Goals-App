import axios from 'axios';
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
    DELETE_GOAL_FAIL,
    DELETE_ALL_GOALS_SUCCESS,
    DELETE_ALL_GOALS_FAIL,
} from './types';

const domain = 'http://localhost:3000';

export const getAllGoals = () => dispatch => {
    const token = getToken();

    axios.get(`${domain}/api/goal/get-all/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        dispatch({
            type: GET_ALL_SUCCESS,
            payload: res.data
        });
    }).catch((e) => {
        dispatch({
            type: GET_ALL_FAIL,
            error: e.response.data.error,
        });
    });
}

export const createGoal = (body) => dispatch => {
    const token = getToken();

    axios.post(`${domain}/api/goal/create/`, {
        ...body
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        if(res.status !== 400 || res.status !== 401) {
            dispatch({
                type: CREATE_GOAL_SUCCESS,
                payload: res.data
            });
        }
    }).catch((e) => {
        dispatch({
            type: CREATE_GOAL_FAIL,
            error: e.response.data.error
        });
    });
}

export const updateGoal = (id, body) => dispatch => {
    const token = getToken();

    axios.patch(`${domain}/api/goal/update-one/${id}/`, {
        ...body
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        if(res.status === 200) {
            dispatch({
                type: UPDATE_GOAL_SUCCESS,
                payload: res.data,
                _id: id,
            });
        }
    }).catch((e) => {
        dispatch({
            type: UPDATE_GOAL_FAIL,
            error: e.response.data.error,
        });
    });
}

export const deleteGoal = (id) => dispatch => {
    const token = getToken();

    axios.delete(`${domain}/api/goal/delete-one/${id}/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        if(res.status === 200) {
            dispatch({
                type: DELETE_GOAL_SUCCESS,
                payload: res.data,
            });
        }
    }).catch((e) => {
        dispatch({
            type: DELETE_GOAL_FAIL,
            payload: e.response.data.error,
        });
    });
}

export const deleteAllGoals = (password) => dispatch => {
    const token = getToken();

    axios.delete(`${domain}/api/goal/delete-all/`, {
        data: {
            'password': password
        },
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }).then((res) => {
        if(res.status === 200) {
            dispatch({
                type: DELETE_ALL_GOALS_SUCCESS,
                payload: res.data,
            });
        }
    }).catch((e) => {
        dispatch({
            type: DELETE_ALL_GOALS_FAIL,
            error: e.response.data.error,
        });
    });
}

export const flipSubmitSuccess = () => dispatch => {
    dispatch({
        type: FLIP_SUBMIT,
    });
}



export const getToken = () => {
    return localStorage.getItem('token');
}