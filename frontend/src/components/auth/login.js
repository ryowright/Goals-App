import React, { Component } from 'react';
import { Grid, TextField, Button, InputAdornment, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { AccountCircle, LockRounded } from '@material-ui/icons';
import theme from '../../muithemes/auththeme';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { Alert } from 'react-bootstrap';
import './static/login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        }
    }

    handleLogin = () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        this.setState({show: true});
        this.props.login(username, password);
    }

    render() {
        
        if (this.props.isAuthenticated){
            return <Redirect to="/"/>
        }

        return (
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
                            <Grid container justify="center">
                                <img
    
    
                                />
                            </Grid>
                            <ThemeProvider theme={theme}>
                                <Typography variant="h2" align="center">Goals App</Typography>
                            </ThemeProvider>

                            {this.props.error && this.state.show ?
                            <Alert variant='danger' onClose={() => this.setState({show: false})} dismissible>
                                <Alert.Heading align="center">Error</Alert.Heading>
                                <p align="center">
                                    {this.props.error}
                                </p>
                            </Alert>  :
                            ""
                            }

                            <TextField 
                                id="username"
                                label="Username"
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                id="password"
                                type="password"
                                label="Password"
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockRounded />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Link className="forgot-password" align="left" to="/forgot-password">Forgot your password?</Link>
                            <div style={{ height: 20 }} />
                            <Button color="primary" variant="contained" onClick={this.handleLogin}>
                                Log in
                            </Button>
                            <div style={{ height: 20 }} />
                            <Link className="sign-up-link" align="center" to="/register">Don't have an account? Sign up here.</Link>
                        </div>
                        <div />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuth,
        isRegistered: state.auth.isRegistered,
        error: state.auth.error
    }
}

export default connect(mapStateToProps, { login })(Login);