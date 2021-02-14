import axios from 'axios';

import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
} from './types';

// const domain = 'http://localhost:3000'
const domain = 'https://goal-setting-web-app.herokuapp.com/login';

export const login = (username, password) => async dispatch => {
    try {
        const res = await axios.post(`${domain}/api/user/login/`, {
            "name": username,
            "password": password
        });
        if (res.status === 200) {
            await localStorage.setItem('token', res.data.token);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
                username: username,
            });
        }
    }
    catch(e) {
        dispatch({
            type: LOGIN_FAIL,
            error: e.response.data.error
        });
    }
}


export const getUser = () => (dispatch) => {
    const token = getToken();

    axios.get(`${domain}/api/user/me/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        dispatch({
            type: GET_USER_SUCCESS,
            payload: res.data,
        });
    }).catch((e) => {
        dispatch({
            type: GET_USER_FAIL,
            error: e.response.data.error
        });
    });
}


export const logout = () => dispatch => {
    const token = getToken();
    localStorage.clear();

    axios.post(`${domain}/api/user/logout/`, null, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        if (res.status === 200) {
            dispatch({
                type: LOGOUT_SUCCESS,
                payload: res.data
            });

            localStorage.removeItem('token');
        }
    }).catch((e) => {
        alert('Logout unsuccessful.')
    });
}

export const register = (username, email, password) => dispatch => {
    axios.post(`${domain}/api/user/register/`, {
        "name": username,
        "email": email,
        "password": password
    }).then((res) => {
        if (res.status === 200) {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        }
    }).catch((e) => {
        dispatch({
            type: REGISTER_FAIL,
            error: e.response.data.error
        });
    });
}

export const forgotPasswordPost = (email) => dispatch => {
    axios.post(`${domain}/api/user/reset-password-email/`, {
        "email": email,
    }).then((res) => {
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: res.data,
        });
    }).catch((e) => {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            error: e.response.data.error
        });
    });
}

export const resetPasswordPost = (password, resetToken) => dispatch => {
    axios.post(`${domain}/api/user/reset-password/`, {
        "password": password,
        "resetToken": resetToken
    }).then((res) => {
        if (res.status === 200) {
            dispatch({
                type: PASSWORD_RESET_SUCCESS,
                payload: res.data
            });
        }
    }).catch((e) => {
        dispatch({
            type: PASSWORD_RESET_FAIL,
            error: e.response.data.error
        });
    });
}

export const deleteAccount = (password) => dispatch => {
    const token = getToken();

    axios.delete(`${domain}/api/user/me/`, {
        data: {
            'password': password
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        localStorage.clear();
        dispatch({
            type: DELETE_USER_SUCCESS,
        });
    }).catch((e) => {
        dispatch({
            type: DELETE_USER_FAIL,
            error: e.response.data.error,
        });
    });
}

export const updateUser = (body) => dispatch => {
    const token = getToken();

    axios.patch(`${domain}/api/user/update/`, {...body}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        dispatch({
            type: UPDATE_USER_SUCCESS,
        });
    }).catch((e) => {
        dispatch({
            type: UPDATE_USER_FAIL,
            error: e.response.data.error,
        });
    });
}

export const getToken = () => {
    return localStorage.getItem('token');
}