import React, {useReducer, useContext} from 'react';
import AuthContext from './AuthContext';
import AuthReducer from './AuthReducer';
import {setAuthToken} from '../../utils';
import axios from 'axios';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS,
    EDIT_SUCCESS,
    EDIT_FAIL,
    DELETE_SUCCESS,
    DELETE_FAIL
} from './types';
import {notAuthenticatedRoutes} from "../../utils";

const AuthState = props => {

    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        user: null,
        errors: false,
        routes: notAuthenticatedRoutes,
        loading: true
    };

    const [state, dispatch] = useReducer(AuthReducer, initialState);

    const loadUser = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get('/api/auth/logged-in');

            dispatch({type: USER_LOADED, payload: res.data.user});
        } catch (err) {
            dispatch({type: AUTH_ERROR, payload: err.response.data.errors})
        }
    }

    const register = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/users/register', formData, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: {
                    token: res.data.token
                }
            });

            loadUser();
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload: {
                    errors: err.response.data.errors
                }
            })
        }
    }

    const login = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/api/auth/login', formData, config);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    token: res.data.token
                }
            });

            loadUser();
        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                payload: {
                    errors: err.response.data.errors
                }
            })
        }
    }

    const edit = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                'id': state.user._id
            }
        }
        try {
            const res = await axios.put(`/api/users/edit`, formData, config);
            dispatch({
                type: EDIT_SUCCESS,
                payload: res.data.user
            })
        } catch (err) {
            console.error(err);
            dispatch({
                type: EDIT_FAIL,
                payload: err.response.data.errors
            })
        }
    }

    const deleteUser = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                'id': state.user._id
            }
        }
        try {
            const res = await axios.delete('/api/users/delete', config);
            dispatch({
                type: DELETE_SUCCESS
            });
        } catch (err) {
            console.error(err);
            dispatch({
                type: DELETE_FAIL,
                payload: err.response.data.errors
            });
        }
    }


    const logout = () => dispatch({type: LOGOUT})

    const clearErrors = () => dispatch({
        type: CLEAR_ERRORS
    })

    if (state.loading) {
        loadUser();
    }

    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                routes: state.routes,
                errors: state.errors,
                loadUser,
                login,
                register,
                logout,
                clearErrors,
                edit,
                deleteUser,
                logout
            }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState;