import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import axios from 'axios';
import Admin from "layouts/Admin.js";
import AuthState from '../src/context/auth/AuthState'
import AlertState from '../src/context/alert/AlertState'

const App = () => {

    return (
        <AuthState>
            <AlertState>
                <Router>
                    <Switch>
                        <Route path="/admin" component={Admin}/>
                        <Redirect from="admin/dashboard" to="/admin/login"/>
                    </Switch>
                </Router>
            </AlertState>
        </AuthState>
    )
}

export default App;