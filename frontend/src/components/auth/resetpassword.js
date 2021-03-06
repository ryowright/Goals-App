import React, { useState } from 'react';
import { Grid, TextField, Button, InputAdornment, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { LockRounded } from '@material-ui/icons';
import { Link, useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { resetPasswordPost } from '../../actions/auth';
import { connect, useDispatch, useSelector } from 'react-redux';
import theme from '../../muithemes/auththeme';
import './static/forgotpassword.css';


const ResetPassword = () => {

    const [ show, setShow ] = useState(false);
    const [ noMatch, setNoMatch ] = useState(false);

    const { resetPassword } = useSelector(state => ({
        resetPassword: state.auth.resetPassword,
    }))

    let { resettoken } = useParams();
    const dispatch = useDispatch();

    const handleResetPassword = (resetToken) => {
        const password = document.getElementById('password').value
        const confPassword = document.getElementById('confirmPassword').value
        setShow(true);
        
        if (password !== confPassword) {
            return setNoMatch(true);
        }

        setNoMatch(false);
        dispatch(resetPasswordPost(password, resetToken));
    }

    const checkError = () => {
        const { error, resetPassword } = useSelector(state => ({
            error: state.auth.error,
            resetPassword: state.auth.resetPassword,
        }))

        if (resetPassword && show) {
            return (
                <Alert variant='success' >
                <Alert.Heading align="center">Success!</Alert.Heading>
                    <p align="center">
                        Your password has been reset successfully.
                    </p>
                </Alert>
            )
        } else if (noMatch && show) {
            return (
                <Alert variant='danger' onClose={() => setShow(false)} dismissible>
                <Alert.Heading align="center">Error</Alert.Heading>
                    <p align="center">
                        Passwords do not match.
                    </p>
                </Alert>
            )
        } else if (error && show) {
            return (
                <Alert variant='danger' onClose={() => setShow(false)} dismissible>
                <Alert.Heading align="center">Error</Alert.Heading>
                    <p align="center">
                        {error}
                    </p>
                </Alert>
            )
        }
        return (
            <Typography className="forgot-description" align="center">Fill in your new password below.</Typography>
        )
    }

    const inputFields = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 400, minWidth: 300 }}>
                <TextField 
                      id="password"
                      label="Password"
                      type="password"
                      margin="normal"
                      InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                  <LockRounded />
                              </InputAdornment>
                          ),
                      }}
                  />
                  <TextField 
                      id="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      margin="normal"
                      InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                  <LockRounded />
                              </InputAdornment>
                          ),
                      }}
                  />
                  <div style={{ height: 20 }} />
                  <Button color="primary" variant="contained" onClick={() => handleResetPassword(resettoken)}>
                      Confirm Password
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
                      <Typography variant="h4" align="center">Reset Password</Typography>
                      <div style={{ height: 10 }} />
                      {checkError()}
                  </ThemeProvider>
                  {!resetPassword ? inputFields() : ""}
                  <div style={{ height: 20 }} />
                  <Link align="center" to="/login">Back to login page.</Link>
              </div>
              <div />
          </Grid>
      </Grid>
    </div>
  )
}

export default connect(null, { resetPasswordPost })(ResetPassword)