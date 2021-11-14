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
import {authenticatedRoutes, notAuthenticatedRoutes} from "../../utils";

export default (state, action) => {
    switch (action.type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                routes: authenticatedRoutes,
                loading: false
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                routes: authenticatedRoutes,
                loading: false
            };
        case EDIT_SUCCESS:
            return {
                ...state,
                user: action.payload
            }
        case EDIT_FAIL:
            return {
                ...state,
                errors: action.payload
            }
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
        case LOGOUT:
        case DELETE_SUCCESS:
            localStorage.removeItem('token');
            return {
                ...state,
                ...action.payload,
                token: null,
                isAuthenticated: false,
                user: null,
                routes: notAuthenticatedRoutes,
                loading: false
            };
        case DELETE_FAIL:
            return {
                ...state,
                errors: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            throw new Error(`Unsupported type of: ${action.type}`);
    }
}