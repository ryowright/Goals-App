import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { updateUser, deleteAccount, getUser } from '../../actions/auth';
import { deleteAllGoals } from '../../actions/goal';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Appbar from '../dashboard/appbar';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#008c3a',
    },
    secondary: {
      main: '#b71c1c',
    },
    tertiary: {
      main: '#90caf9',
    },
  }
});

const dialogTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
  }
})

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1, //'#efe4d5', -- lighter tan
    backgroundColor: "#dac09e",
    minHeight: "100vh",
  },
  paper: {
    padding: theme.spacing(10),
    textAlign: "center",
    minHeight: "75vh",
    minWidth: "70vh",
  },
  formControl: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
  checkbox: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(0),
    minWidth: 300,
  },
  button: {
    margin: theme.spacing(2),
  },
  divider: {
    minWidth: 500,
  },
  dialog: {
    minWidth: 400,
  },
}));

const SettingsGrid = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [ open, setOpen ] = useState(false);
  const [ message, setMessage ] = useState("");
  const [ title, setTitle ] = useState("");
  const [ update, setUpdate ] = useState("");
  const [ showError, setShowError ] = useState(false);
  const [ name, setName ] = useState("");
  const { username, error } = useSelector(state => ({
    username: state.auth.username,
    error: state.auth.error,
  }));

  useEffect(() => {
    if (!username) {
      dispatch(getUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (localStorage.getItem('route') !== '/settings') {
      localStorage.setItem('route', '/settings');
    }
  });

  useEffect(() => {
    setName(username);
  }, [username]);

  const messages = {
    "goals": "Are you sure you want to delete all of your goals? This change cannot be undone. Please enter your password to confirm this change.",
    "account": "Are you sure you want to delete your account? This change cannot be undone. Please enter your password to confirm this change.",
    "username": "Please enter your password to confirm your new username."
  }

  const titles = {
    "goals": "Delete My Goals",
    "account": "Delete My Account",
    "username": "Change My Username",
  }

  const handleClose = () => {
    setOpen(false);
    setUpdate("");
  }

  const checkPassMatch = () => {
    const pass = document.getElementById('password').value;
    const confPass = document.getElementById('confirmPassword').value;

    if (pass !== confPass) {
      setError("Passwords do not match.");
      setShowError(true);
      return true;
    } else {
      return false;
    }
  }

  const confirmUpdateUsername = () => {
    const newUsername = document.getElementById('username').value;
    if (checkPassMatch) {
      dispatch(updateUser({ name: newUsername }));
    }
  }

  const confirmUpdatePassword = () => {
    const oldPass = document.getElementById('oldPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confNewPass = document.getElementById('confNewPassword').value;

    if (newPass !== confNewPass) {
      setError("Passwords do not match.");
      setShowError(true);
      return;
    }

    dispatch(updateUser({ 
      oldPassword: oldPass, 
      password: newPass,
    }));
  }

  const confirmDeleteAllGoals = () => {
    const pass = document.getElementById('password').value;
    if (checkPassMatch) {
      dispatch(deleteAllGoals(pass));
    }
  }

  const confirmDeleteAccount = () => {
    const pass = document.getElementById('password').value;
    if (checkPassMatch) {
      dispatch(deleteAccount(pass));
    }
  }

  const handleUpdateUsername = () => {
    // HANDLE USERNAME UPDATE
    setUpdate("username");
    setOpen(true);
    setTitle(titles.username);
    setMessage(messages.username);
  }

  const handleDeleteGoals = () => {
    // OTHER CODE FOR DELETING ALL GOALS
    setUpdate("deletegoals");
    setOpen(true);
    setTitle(titles.goals);
    setMessage(messages.goals);
  }

  const handleDeleteAccount = () => {
    // OTHER CODE FOR DELETING ACCOUNT
    setUpdate("deleteaccount");
    setOpen(true);
    setTitle(titles.account);
    setMessage(messages.account);
  }

  const handleConfirm = () => {
    switch(update) {
      case "username":
        confirmUpdateUsername();
        handleClose();
        break;

      case "deletegoals":
        confirmDeleteAllGoals();
        handleClose();
        break;

      case "deleteaccount":
        confirmDeleteAccount();
        handleClose();
        break;

      default:
        break;
    }
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  return (
  <div className={classes.root}>
    <Appbar title="Settings"/>
    <Grid container direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
    <ThemeProvider theme={theme}>
      <ThemeProvider theme={dialogTheme}>
      <Dialog open={open} onClose={handleClose} className={classes.dialog}>
        <DialogTitle >{title}</DialogTitle>
        <DialogContent>
          <Typography align="center">{message}</Typography>

          <TextField
            required
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          inputProps={{maxLength: 200}}
          />

          <TextField
            required
            autoFocus
            margin="dense"
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
          inputProps={{maxLength: 200}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      </ThemeProvider>
      <Grid item xs={6}>
        <Paper className={classes.paper} >
          <Grid container direction="column" alignItems="center" justify="center">
            <ThemeProvider theme={dialogTheme}>
            <TextField
              className={classes.textField}
              id="username"
              label="Change Username"
              value={name || ""}
              onChange={handleNameChange}
            />
            </ThemeProvider>
        
            <Button 
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={handleUpdateUsername}
              >
                Update Username
            </Button>

            <Divider variant="middle" className={classes.divider}/>

            <ThemeProvider theme={dialogTheme}>
            <TextField
              className={classes.textField}
              id="oldPassword"
              label="Old Password"
              type="password"
            />
            <TextField
              className={classes.textField}
              id="newPassword"
              label="New Password"
              type="password"
            />
            <TextField
              className={classes.textField}
              id="confNewPassword"
              label="Confirm New Password"
              type="password"
            />
            </ThemeProvider>

            <Button 
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={confirmUpdatePassword}
            >
              Update Password
            </Button>

            <Divider variant="middle" className={classes.divider}/>

              <Button 
                color="secondary"
                variant="contained"
                className={classes.button}
                onClick={handleDeleteGoals}
              >
                Delete All Goals
              </Button>
              <Button 
                color="secondary"
                variant="contained"
                className={classes.button}
                onClick={handleDeleteAccount}
              >
                Delete This Account
              </Button>
          </Grid>
        </Paper>
      </Grid>
      </ThemeProvider>
    </Grid>
  </div>
  );
}

export default SettingsGrid;