import {combineReducers} from 'redux';
import pageReducer from './pageReducer';

const rootReducer = combineReducers({
    pageReducer: pageReducer
});

export default rootReducer;
