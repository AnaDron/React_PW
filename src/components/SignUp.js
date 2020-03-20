import React from 'react';
import { NavLink } from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import {
    Avatar,
    Box,
    Button,
    Collapse,
    Grid,
    Link,
    Typography
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from 'formik-material-ui';
import * as Yup from 'yup';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function MyField(props) {
    return (
        <Grid item xs={12}>
            <Field
                component={TextField}
                variant="outlined"
                required
                fullWidth
                {...props}
            />
        </Grid>
    );
}

export default function SignUp() {
    const [error, setError] = React.useState('');

    const classes = useStyles();

    function onSubmit(values, { setErrors, setSubmitting }) {
        fetch(`http://193.124.114.46:3001/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: values.name,
                email: values.email,
                password: values.password
            })
        }).then(res => {
            if (res.status === 200) {
                return res.json().then(json => {
                    return { data: json };
                });
            }

            return res.text().then(errorMessage => {
                return { status: res.status, error: errorMessage };
            });
        }).then(res => {
            if (res.data) {

                return;
            }

            if (res.status === 400) {
                if (res.error === "A user with that email already exists") {
                    setErrors({
                        email: res.error
                    });
                    return;
                }
                if (res.error === "You must send username and password") {
                    setErrors({
                        name: "Invalid value",
                        password: "Invalid value"
                    });
                    return;
                }
            }

            setError(`Unknown error ${res.status} '${res.error}'`);
        }, e => {
            setError(`Unknown error '${e}'`);
        }).then(() => {
            setSubmitting(false);
        });
    }

    let validationSchema = Yup.object({
        name: Yup.string()
            .min(2, 'Must be 2 characters or more')
            .required('Required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
        password: Yup.string()
            .min(6, 'Must be 6 characters or more')
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required')
    });

    return (
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box width="100%">
                <Collapse in={error !== ''}>
                    <Box mt={3}>
                        <Alert severity="error">
                            {error}
                        </Alert>
                    </Box>
                </Collapse>
            </Box>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className={classes.form}>
                        <Grid container spacing={2}>
                            <MyField
                                name="name"
                                label="Name"
                                autoFocus
                            />
                            <MyField
                                name="email"
                                type="email"
                                label="Email Address"
                            />
                            <MyField
                                name="password"
                                type="password"
                                label="Password"
                            />
                            <MyField
                                name="confirmPassword"
                                type="password"
                                label="Confirm password"
                            />
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={isSubmitting}
                        >
                            Sign Up
                      </Button>
                    </Form>
                )}
            </Formik>
            <Grid container justify="flex-end">
                <Grid item>
                    <Link component={NavLink} to="login" variant="body2">
                        Already have an account? Sign in
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
}