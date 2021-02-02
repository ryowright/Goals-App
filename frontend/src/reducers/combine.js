import { combineReducers } from 'redux';
import auth from './auth';
import goal from './goal';

const rootReducer = combineReducers({
    auth,
    goal,
})

export default rootReducer;