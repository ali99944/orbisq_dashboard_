import { combineReducers } from '@reduxjs/toolkit';
import auth_reducer from './stores/auth-store';


const rootReducer = combineReducers({
    auth_store: auth_reducer,
});

export default rootReducer;
