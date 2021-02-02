import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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
}));

const StatusGrid = (props) => {
  const classes = useStyles();

  const numGoals = props.numGoals;
  const completedGoals = props.completedGoals;

  function CircularProgressWithLabel(props) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            props.value * numGoals / 100,
          ) || 0}/${numGoals}`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Grid container item justify="center">
      <Grid item xs={6}>
        <Paper className={classes.paper} >
          <Grid container spacing={2} direction="column">
            <Grid item xs >
              <Typography>
                Goals completed
              </Typography>
              <CircularProgressWithLabel value={completedGoals / numGoals * 100} size={100}/>
            </Grid>
            {/* <Grid item xs>
              <Button variant="contained" color="primary" onClick={() => changeValue(value + 1)}>
                Primary
              </Button>
            </Grid> */}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default StatusGrid;