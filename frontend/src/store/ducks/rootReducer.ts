import { combineReducers } from '@reduxjs/toolkit';
import auth from './auth/slice';

export const rootReducer = combineReducers({
    auth
});