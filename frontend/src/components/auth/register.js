import React, { Component } from 'react';
import { Grid, TextField, Button, InputAdornment, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { AccountCircle, LockRounded, EmailRounded } from '@material-ui/icons';
import theme from '../../muithemes/auththeme';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
import { Alert } from 'react-bootstrap';
import './static/register.css';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            show: false,
            errorMessage: ""
        }
    }


    handleRegister = () => {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        this.setState({error: false})

        if (password !== confirmPassword) {
            return this.setState({error: true,
                                  errorMessage: "Passwords do not match."})
        }

        this.setState({show: true})
        this.props.register(username, email, password);
        
    }

    checkError = () => {
        if (this.state.error) {
            return (
                <Alert variant='danger' onClose={() => this.setState({error: false, show: false})} dismissible>
                <Alert.Heading align="center">Error</Alert.Heading>
                    <p align="center">
                        {this.state.errorMessage}
                    </p>
                </Alert>
            )
        } else if (this.props.error && this.state.show && !this.props.isRegistered) {
            return (
                <Alert variant='danger' onClose={() => this.setState({error: false, show: false})} dismissible>
                <Alert.Heading align="center">Error</Alert.Heading>
                    <p align="center">
                        {this.props.error}
                    </p>
                </Alert>
            )
        }
    }

    regMessage = `Account succesfully registered. 
                  A Verification email has been sent.
                  You must verify your account before logging in.`

    render() {

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

                            {this.checkError()}

                            {
                                this.props.isRegistered && this.state.show ? 
                                <Grid container item xs justify="center" alignItems="center">
                                    <div style={{ height: 10 }} />
                                    <Alert variant='success' onClose={() => this.setState({show: false})} dismissible>
                                        <Alert.Heading align="center">Success!</Alert.Heading>
                                        <p align="center">
                                            {this.regMessage}
                                        </p>
                                    </Alert>
                                    <div style={{ height: 20 }} />
                                    <Link align="center" to="/login">Back to Login.</Link>
                                </Grid> :
                                <div style={{ display: "flex", flexDirection: "column", maxWidth: 400, minWidth: 300 }}>
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
                                    id="email"
                                    type="email"
                                    label="Email"
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailRounded />
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
                                <TextField
                                    id="confirmPassword"
                                    type="password"
                                    label="Confirm Password"
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <div style={{ height: 10 }} />
                                <Button color="primary" variant="contained" onClick={this.handleRegister}>
                                    Sign up
                                </Button>
                                <div style={{ height: 20 }} />
                                <Link align="center" to="/login">Already have an account? Login here.</Link>
                                </div>
                            }
                            
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
        isRegistered: state.auth.isRegistered,
        error: state.auth.error
    }
}


export default connect(mapStateToProps, { register })(Register);



{/* <Typography className="reg-description" align="center">{this.regMessage}</Typography> */}

// {this.state.error ?
//     <Alert variant='danger' onClose={() => this.setState({error: false})} dismissible>
//         <Alert.Heading align="center">Error</Alert.Heading>
//         <p align="center">
//             {this.state.errorMessage}
//         </p>
//     </Alert>  :
//     ""
//     }