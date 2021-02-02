import axios from 'axios';

import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    USER_LOADING,
    USER_LOADED,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL
} from './types';

const domain = 'http://localhost:3000'

export const login = (username, password) => dispatch => {
    axios.post(`${domain}/api/user/login/`, {
        "name": username,
        "password": password
    }).then((res) => {
        if (res.status === 200) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
                username: username,
            });

            localStorage.setItem('token', res.data.token)
        }
    }).catch((e) => {
        dispatch({
            type: LOGIN_FAIL,
            error: e.response.data.error
        });
    });
}

export async function getUser(dispatch, getState) {
    const token = getToken();

    await axios.get(`${domain}/api/user/me/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        dispatch({
            type: GET_USER_SUCCESS,
            // COMPLETE
        });
    }).catch((e) => {
        dispatch({
            type: GET_USER_FAIL,
            error: e.response.data.error
        });
    });
}

// export const getUser = () => async (dispatch) => {    // ----
//     const token = getToken();
//     console.log('getting user');

//     await axios.get(`${domain}/api/user/me/`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     }).then((res) => {
//         dispatch({
//             type: GET_USER_SUCCESS,
//             // COMPLETE
//         });
//     }).catch((e) => {
//         dispatch({
//             type: GET_USER_FAIL,
//             error: e.response.data.error
//         });
//     });
// }


export const logout = () => dispatch => {
    const token = getToken();

    axios.post(`${domain}/api/user/logout/`, null, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        console.log('logout successful')
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

export const getToken = () => {
    return localStorage.getItem('token');
}