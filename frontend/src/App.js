import React, { Component } from 'react';
import Login from './components/auth/login';
import Register from './components/auth/register';
import ForgotPassword from './components/auth/forgotpassword';
import ResetPassword from './components/auth/resetpassword';
import Dashboard from './components/dashboard';
import rootReducer from './reducers/combine';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom";
import './static/App.css';
import ProtectedRoute from './components/routes/protectedroute';
import SettingsGrid from './components/settings/settingsgrid';

class App extends Component {

    store = createStore(rootReducer, applyMiddleware(thunk));

    render() {
        return (
            <div>
            <Provider store={this.store}>
            <Router>
            {localStorage.getItem('route') ? <Redirect to={`${localStorage.getItem('route')}`}/> : ""}
            <Switch>
                <ProtectedRoute exact path="/settings" component={SettingsGrid} />
                <ProtectedRoute exact path="/" component={Dashboard} />
                <Route exact path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/forgot-password">
                    <ForgotPassword />
                </Route>
                <Route
                    path="/reset-password"
                    render={({ match: { url } }) => (
                    <>
                        <Route path={`${url}/:resettoken`} component={ResetPassword} />
                    </>
                    )}
                />
            </Switch>
            </Router>
            </Provider>
            </div>
        );
    }
}

export default App;