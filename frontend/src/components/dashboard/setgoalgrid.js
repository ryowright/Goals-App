import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useDispatch, useSelector } from 'react-redux';
import { createGoal, flipSubmitSuccess } from '../../actions/goal';
import { Alert } from 'react-bootstrap';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1, //'#efe4d5', -- lighter tan
    backgroundColor: "#dac09e",
    minHeight: "100vh",
  },
  paper: {
    padding: theme.spacing(10),
    textAlign: "center",
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
    marginTop: theme.spacing(1),
    minWidth: 150,
  },
}));

function FormDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [ openError, setOpenError ] = useState(true);
  const [open, setOpen] = useState(false);
  const [renewType, setRenewType] = useState('');
  const [showRenewable, setShowRenewable] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const { error, submitSuccess } = useSelector(state => ({
    error: state.goal.error,
    submitSuccess: state.goal.submitSuccess,
  }));

  useEffect(() => {
    if (error) {
      setOpenError(true);
    }
  }, [error]);


  if (submitSuccess && open) {
    setOpenError(false);
    setOpen(false);
  }

  const handleClickOpen = () => {
    dispatch(flipSubmitSuccess());
    setOpenError(false);
    setShowProgress(false);
    setShowRenewable(false);
    setOpen(true);
    console.log(open);
  };

  const handleClose = () => {
    setOpenError(false);
    setOpen(false);
  };

  const handleSubmit = () => {
    let renewTypeData = renewType;
    let progress = null;
    let numericGoal = null;
    let deadline = document.getElementById('deadline').value;
    let goal = document.getElementById('goal').value;

    if (!deadline) {
      deadline = null;
    }
    
    if (!showRenewable) {
      setRenewType('');
    }

    if (!renewTypeData) {
      renewTypeData = null;
    }

    if (showProgress) {
      progress = document.getElementById('progress').value;
      numericGoal = document.getElementById('numericGoal').value;
    }

    const body = {
      goal,
      deadline,
      renewable: showRenewable,
      setNumericGoal: showProgress,
      renewType: renewTypeData,
      progress,
      numericGoal,
    };

    // console.log(body);
    dispatch(createGoal(body));
  };

  const handleChange = (event) => {
    setRenewType(event.target.value);
  };

  const handleRenewable = (event) => {
    setShowRenewable(event.target.checked);
  };

  const handleProgress = (event) => {
    setShowProgress(event.target.checked);
  };

  // console.log('render')
  return (
    <div style={{ padding: 0 }}>
      <Button variant="outlined" color="primary" onClick={handleClickOpen} fullWidth>
        Set A New Goal
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle >Set A New Goal</DialogTitle>
        <DialogContent>
          {
            error && openError ? 
            <Alert variant="danger" onClose={() => setOpenError(false)} dismissible>
              {error}
            </Alert>
            : ""
          }
          <TextField
            required
            multiline
            autoFocus
            margin="dense"
            id="goal"
            label="Goal"
            type="text"
            fullWidth
          inputProps={{maxLength: 200}}
          />

          <form className={classes.container} noValidate>
            <TextField
              id="deadline"
              label="Deadline"
              type="datetime-local"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </form>

          <FormGroup aria-label="position">
          <FormControl component="fieldset" fullWidth>
            <FormGroup aria-label="position" row>
              <FormControlLabel
                className={classes.checkbox}
                control={
                  <Checkbox
                    id="renewable"
                    onChange = {handleRenewable}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                }
                label="Renewable"
                labelPlacement="start"
              />
              <FormControlLabel
                className={classes.checkbox}
                control={
                  <Checkbox
                    id="setNumericGoal"
                    onChange = {handleProgress}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                }
                label="Set Numeric Goal"
                labelPlacement="start"
              />
            </FormGroup>
          </FormControl>
          <Divider />
          <FormControl required className={classes.formControl} fullWidth>
            {showRenewable ?
            <div>
              <InputLabel>Renew type</InputLabel>
              <Select
                id="renewType"
                value={renewType}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value={'Daily'}>Daily</MenuItem>
                <MenuItem value={'Weekly'}>Weekly</MenuItem>
                <MenuItem value={'Monthly'}>Monthly</MenuItem>
                <MenuItem value={'Annually'}>Annually</MenuItem>
              </Select>
            </div>
             :
              ""
            }

            {showProgress ?
            <div>
              <TextField
              required
              autoFocus
              className={classes.textField}
              id="progress"
              label="Current Progress"
              type="number"
              fullWidth
            />

            <TextField
              required
              autoFocus
              className={classes.textField}
              id="numericGoal"
              label="Target Number"
              type="number"
              fullWidth
            />
            </div> :
            ""
            }
    
          </FormControl>
          </FormGroup>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Set Goal
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const SetGoalGrid = () => {
  const classes = useStyles();

  return (
    <Grid container item justify="center" >
      <Grid item xs={5}>
        <Paper className={classes.paper}>
          <Grid container spacing={2} direction="column">
            <Grid item xs>
              <FormDialog />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default SetGoalGrid;