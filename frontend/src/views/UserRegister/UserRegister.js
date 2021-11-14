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
import {isBlank, onChange, validateEmail} from '../../utils';
import AlertContext from '../../context/alert/AlertContext';
import AuthContext from '../../context/auth/AuthContext';
import Alerts from '../../layouts/Alerts'
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

export default function UserRegister(props) {
    const authContext = useContext(AuthContext);
    const alertContext = useContext(AlertContext);

    const {register, errors, clearErrors, isAuthenticated} = authContext;
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

    const [registerFields, setField] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    })

    const {firstName, lastName, username, email, password, passwordConfirmation} = registerFields;

    const onFieldChange = e => onChange(setField, e, registerFields);

    const onSubmit = e => {
        e.target.disabled = true;
        if (!Object.values(registerFields).every(field => !isBlank(field))) return setAlert("Please fill out all of the fields.", "danger");
        if (password !== passwordConfirmation) return setAlert("Passwords don't match.", 'danger');
        if (!validateEmail(email)) return setAlert('Please enter a valid email address.', 'danger');
        if (password.trim().length < 6) return setAlert('Password must be at least 6 characters.', 'danger');
        const user = {
            firstName,
            lastName,
            username,
            email,
            password
        };
        register(user);
    }

    const classes = useStyles();

    return (
        <div>
            <Alerts/>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>Register Account</h4>
                            <p className={classes.cardCategoryWhite}>Register an account</p>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="First Name"
                                        id="first-name"
                                        value={firstName}
                                        name="firstName"
                                        onChange={onFieldChange}
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Last Name"
                                        id="last-name"
                                        value={lastName}
                                        name="lastName"
                                        onChange={onFieldChange}
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Username"
                                        id="username"
                                        value={username}
                                        name="username"
                                        onChange={onFieldChange}
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Email address"
                                        id="email-address"
                                        value={email}
                                        name="email"
                                        onChange={onFieldChange}
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
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
                                <GridItem xs={12} sm={12} md={6}>
                                    <CustomInput
                                        labelText="Password Confirmation"
                                        id="password-confirmation"
                                        name="passwordConfirmation"
                                        value={passwordConfirmation}
                                        onChange={onFieldChange}
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        <CardFooter>
                            <Button onClick={onSubmit} color="primary">Register</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}

