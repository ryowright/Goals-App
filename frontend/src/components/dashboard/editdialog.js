import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';


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
  const [ openError, setOpenError ] = useState(true);
  const [open, setOpen] = useState(props.open);
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

  const handleClose = () => {
    setOpenError(false);
    if (openDialog) {
      openDialog = !openDialog;
    }
  };

  const handleUpdate = () => {
    let renewType = null;
    let progress = null;
    let numericGoal = null;
    let deadline = document.getElementById('deadline').value;
    let goal = document.getElementById('goal').value;

    if (!deadline) {
      deadline = null;
    }
    
    if (showRenewable) {
      renewType = document.getElementById('renewType').value;
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
      renewType,
      progress,
      numericGoal,
    };

    dispatch(updateGoal(body));
  };

  return (
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle >Set A New Goal</DialogTitle>
      <DialogContent>
       
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Update Goal
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditDialog;