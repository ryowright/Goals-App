import React, { useState } from 'react';
import { Grid, TextField, Button, InputAdornment, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { AccountCircle, LockRounded } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { forgotPasswordPost } from '../../actions/auth';
import theme from '../../muithemes/auththeme';
import { Alert } from 'react-bootstrap';
import './static/forgotpassword.css';


const ForgotPassword = () => {

    const [show, setShow] = useState(false);
    const dispatch = useDispatch();

    const { resetEmail } = useSelector(state => ({
        resetEmail: state.auth.resetEmail,
    }))

    const handleForgotPassword = () => {

        const email = document.getElementById('email').value
        setShow(true);

        console.log({ email })
        dispatch(forgotPasswordPost(email));
    }

    const checkError = () => {
        const { resetEmail, error } = useSelector(state => ({
            resetEmail: state.auth.resetEmail,
            error: state.auth.error
        }))


        if (error && show) {
            return (
                <Alert variant='danger' onClose={() => setShow(false)} dismissible>
                <Alert.Heading align="center">Error</Alert.Heading>
                    <p align="center">
                        {error}
                    </p>
                </Alert>
            )
        } else if (resetEmail && show) {
            return (
                <Alert variant='success'>
                <Alert.Heading align="center">Success!</Alert.Heading>
                    <p align="center">
                        An email has been sent with a link to reset your password.
                    </p>
                </Alert>
            )
        }

        return (
            <Typography className="forgot-description" align="center">
                No worries! Just fill in the email 
                associated with your account
                and we'll send you a link to reset 
                your password.
            </Typography>
        )
    }

    const inputFields = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 400, minWidth: 300 }}>
            <TextField 
                id="email"
                label="Email"
                margin="normal"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                }}
            />
            <div style={{ height: 20 }} />
            <Button color="primary" variant="contained" onClick={handleForgotPassword}>
                Reset Password
            </Button>
            </div>
        )
    }

    return(
    <div style={{height: "100vh"}}>
      <Grid container style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
          <Grid item xs={12} sm={6}>
              <img
                  src="https://skyticket.com/guide/wp-content/uploads/2019/06/iStock-152169403.jpg"
                  style={{width: "100%", height: "100%", objectFit: "cover"}}
                  alt="brand"
              />
          </Grid>
          <Grid 
              container
              item 
              xs={12} 
              sm={6}
              alignItems="center"
              direction="column"
              justify="space-between"
              style={{ padding: 10 }}
          >
              <div />
              <div style={{ display: "flex", flexDirection: "column", maxWidth: 400, minWidth: 300 }}>
                  <ThemeProvider theme={theme}>
                      <Typography variant="h4" align="center">Forgot your password?</Typography>
                      <div style={{ height: 10 }} />
                      {checkError()}
                  </ThemeProvider>
                    {!resetEmail ? inputFields() : ""}
                  <div style={{ height: 20 }} />
                  <Link className="sign-up-link" align="center" to="/login">Back to login page.</Link>
              </div>
              <div />
          </Grid>
      </Grid>
    </div>
  )
}

export default connect(null, { forgotPasswordPost })(ForgotPassword)