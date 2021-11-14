import React, {useState, useContext, useEffect} from "react";
// @material-ui/core components
import {makeStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import {onChange, isBlank, validateEmail} from '../../utils';
import AlertContext from '../../context/alert/AlertContext';
import AuthContext from '../../context/auth/AuthContext';
import Alerts from "../../layouts/Alerts";

import avatar from "assets/img/faces/marc.jpg";

const styles = {
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};

const useStyles = makeStyles(styles);

export default function UserLogin(props) {

    const authContext = useContext(AuthContext);
    const alertContext = useContext(AlertContext);

    const {login, errors, clearErrors, isAuthenticated} = authContext;
    const {setAlert} = alertContext;

    useEffect(() => {
        if (isAuthenticated) {
            props.history.push('/edit');
        }

        if (errors) {
            errors.forEach(err => setAlert(err.msg, 'danger'));
            clearErrors();
        }
    }, [errors, isAuthenticated, props.history]);

    const [loginFields, setField] = useState({
        email: '',
        password: ''
    })

    const {email, password} = loginFields;

    const onFieldChange = e => onChange(setField, e, loginFields);

    const classes = useStyles();

    const onSubmit = e => {
        e.target.disabled = true;
        if (!Object.values(loginFields).every(field => !isBlank(field))) return setAlert("Please fill out all of the fields.", "danger");
        if (!validateEmail(email)) return setAlert("Please enter a valid email address.", 'danger');
        const credentials = {
            email,
            password
        };
        login(credentials);
    }

    return (
        <div>
            <Alerts/>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Login</h4>
                            <p className={classes.cardCategoryWhite}>Log in to your account</p>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Email"
                                        id="email"
                                        value={email}
                                        name="email"
                                        onChange={onFieldChange}
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Password"
                                        id="password"
                                        value={password}
                                        name="password"
                                        onChange={onFieldChange}
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                            <Button onClick={onSubmit} color="primary">Log in</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
