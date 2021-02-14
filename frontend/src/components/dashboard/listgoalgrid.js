import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import StarIcon from '@material-ui/icons/Star';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateGoal, deleteGoal, flipSubmitSuccess } from '../../actions/goal';
import dateformat from 'dateformat';


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


const EditDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  let myDate = new Date();
  let formattedDeadline = "";

  const [ openError, setOpenError ] = useState(true);
  const [showRenewable, setShowRenewable] = useState(props.goal.renewable);
  const [showProgress, setShowProgress] = useState(props.goal.setNumericGoal);
  const [renewType, setRenewType] = useState(props.goal.renewType || "");

  const { error } = useSelector(state => ({
    error: state.goal.error,
  }));

  useEffect(() => {
    if (error) {
      setOpenError(true);
    }
  }, [error]);

  useEffect(() => {
    setShowRenewable(props.goal.renewable);
    setShowProgress(props.goal.setNumericGoal);
  }, [props.open]);

  useEffect(() => {
    if (props.submitSuccess && props.open) {
      props.onClose();
    }
  })

  if (props.goal.deadline) {
    myDate = new Date(props.goal.deadline);
    formattedDeadline = dateformat(myDate, "yyyy-mm-dd'T'HH:MM");
  }

  const handleRenewType = (event) => {
    setRenewType(event.target.value);
  };

  const handleRenewable = (event) => {
    setShowRenewable(event.target.checked);
  };

  const handleProgress = (event) => {
    setShowProgress(event.target.checked);
  };

  const handleUpdate = () => {
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

    if (!renewTypeData || !showRenewable) {
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

    dispatch(updateGoal(props.goal._id, body));
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} ref={props.openRef}>
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
          defaultValue={props.goal.goal}
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
            defaultValue={formattedDeadline || ""}
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
                    defaultChecked={props.goal.renewable}
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
                    defaultChecked={props.goal.setNumericGoal}
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
                defaultValue={props.goal.renewType || ""}
                value={renewType} // ---
                onChange={handleRenewType}
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
              defaultValue={props.goal.progress || ""}
              className={classes.textField}
              id="progress"
              label="Current Progress"
              type="number"
              fullWidth
            />

            <TextField
              required
              autoFocus
              defaultValue={props.goal.numericGoal || ""}
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
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update Goal
          </Button>
      </DialogActions>
    </Dialog>
  )
}


const GoalGrid = (props) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const id = props.goal._id;
  const goal = props.goal;

  const [ favorite, setFavorite ] = useState(props.goal.favorite);
  const [ openDialog, setOpenDialog ] = useState(false);
  const openRef = useRef(false);
  const [ anchorEl, setAnchorEl ] = useState(null);
  const open = Boolean(anchorEl);

  const { submitSuccess } = useSelector(state => ({
    submitSuccess: state.goal.submitSuccess,
  }));

  const goalBody = {
    renewable: goal.renewable,
    setNumericGoal: goal.setNumericGoal,
    completed: goal.completed,
    favorite: goal.favorite,
    tags: goal.tags,
    goal: goal.goal,
    deadline: goal.deadline,
    renewType: goal.renewType,
    progress: goal.progress,
    numericGoal: goal.numericGoal
  }

  const handleClickOpen = () => {
    dispatch(flipSubmitSuccess());
    openRef.current = true;
    setOpenDialog(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    openRef.current = false;
    setOpenDialog(false);
  }

  const handleFavorite = (id) => {
    handleClose();
    dispatch(updateGoal(id, { ...goalBody, favorite: !favorite }));
    setFavorite(favorite => !favorite);
  }

  const handleEdit = (id) => {
    handleClose();
    handleClickOpen();
  }

  const handleRemove = (id) => {
    handleClose();
    dispatch(deleteGoal(id));
  }

  const handleComplete = (id) => {
    handleClose();
    dispatch(updateGoal(id, { ...goalBody, completed: true }))
  }

  const options = {
    'Edit': [<EditIcon />, () => handleEdit(id)],
    'Remove': [<DeleteIcon />, () => handleRemove(id)],
  };

  return (
    <Grid container item justify="center">
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <Grid container spacing={2} direction="column">
            <Grid item xs>
              <EditDialog 
                goal={props.goal}
                open={openDialog}
                submitSuccess={submitSuccess}
                openRef={openRef}
                onClose={handleCloseDialog}
              />
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    width: '20ch',
                  },
                }}
              >
                <MenuItem onClick={() => handleFavorite(id)}>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">{ favorite ? "Unfavorite" : "Favorite" }</Typography>
                </MenuItem>
                {Object.keys(options).map((option) => (
                  <MenuItem key={option} onClick={options[option][1]}>
                    <ListItemIcon>
                      {options[option][0]}
                    </ListItemIcon>
                    <Typography variant="inherit">{option}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
            <Grid item xs>
              {props.goal.goal}
            </Grid>
            <Grid item xs>
              <Button variant="outlined" color="primary" onClick={() => handleComplete(id)}>
                Mark as complete
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default GoalGrid;