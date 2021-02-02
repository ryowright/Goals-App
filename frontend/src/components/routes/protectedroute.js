import React, { useEffect } from 'react';
import {
    Route,
    Redirect
  } from "react-router-dom";
import { connect, useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../actions/auth';

const ProtectedRoute = ({component: Component, ...params}) => {
    const dispatch = useDispatch();
    const { auth } = useSelector(state => ({
        auth: state.auth,
        goals: state.goal.goals,
    }));

    console.log(`Auth: ${auth.isAuth}`);

    useEffect(() => {     
        if (!auth.isAuth) {
            dispatch(getUser());
        }                                   // MAY CAUSE JWT MALFORMED ERROR
      } /*, [dispatch]*/);

    console.log('protected route');
    return (
    <Route
        {...params}
        render={props => {
            if (auth.isLoading) {
                return <h2>Loading...</h2>;
            } else if (!auth.isAuth) {
                console.log(auth.isAuth);
                return <Redirect to="/login" />;
            } else {
                return <Component {...props} />;
            }
        }}
    />
    );
};

export default ProtectedRoute;