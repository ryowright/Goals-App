import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Appbar from './dashboard/appbar';
import StatusGrid from './dashboard/statusgrid';
import SetGoalGrid from './dashboard/setgoalgrid';
import GoalGrid from './dashboard/listgoalgrid';
import { getAllGoals } from '../actions/goal';


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

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { goals } = useSelector(state => ({
    goals: state.goal.goals,
  }));
  const numGoals = goals.length;
  const numCompletedGoals = goals.filter(goal => goal.completed).length;
  const incompleteGoals = goals.filter(goal => !goal.completed);

  useEffect(() => {                // MAY CAUSE JWT MALFORMED ERROR
    dispatch(getAllGoals());
  }, [dispatch]);

  return(
  <div className={classes.root} >
    <Appbar title="My Goals"/>
    <div style={{height: 40}}/>
    <Grid container spacing={2} direction="column">
      <StatusGrid numGoals={numGoals} completedGoals={numCompletedGoals}/>
      <SetGoalGrid />
      {incompleteGoals.map((goal) => <GoalGrid key={goal._id} goal={goal}/>)}
    </Grid>
  </div>
  )
}

export default Dashboard;