import axios from 'axios';
import BubbleChart from "@material-ui/icons/BubbleChart";
import UserLogin from "./views/UserLogin/UserLogin";
import Unarchive from "@material-ui/icons/Unarchive";
import UserRegister from "./views/UserRegister/UserRegister";
import Person from "@material-ui/icons/Person";
import UserEdit from "./views/UserEdit/UserEdit";

const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

const onChange = (callback, e, state) => {
    callback({...state, [e.target.name]: e.target.value});
}

const isBlank = str => str.trim().length === 0;

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const notAuthenticatedRoutes = [
    {
        path: '/login',
        name: "Login",
        rtlName: "ملف تعريفي للمستخدم",
        icon: BubbleChart,
        component: UserLogin,
        layout: "/admin"
    },
    {
        path: '/register',
        name: "Register",
        rtlName: "ملف تعريفي للمستخدم",
        icon: Unarchive,
        component: UserRegister,
        layout: "/admin"
    }
]

const authenticatedRoutes = [
    {
        path: "/edit",
        name: "Edit Profile",
        rtlName: "ملف تعريفي للمستخدم",
        icon: Person,
        component: UserEdit,
        layout: "/admin"
    }
]

export {setAuthToken, onChange, validateEmail, isBlank, notAuthenticatedRoutes, authenticatedRoutes};