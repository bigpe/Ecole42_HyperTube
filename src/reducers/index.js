import { combineReducers } from 'redux';
import movie  from './movie.js';
import user from './user.js';

export default combineReducers ({
    user,
    movie
})