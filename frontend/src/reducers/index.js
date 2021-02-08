import { combineReducers } from 'redux';
import movie  from './movie.js';
import user from './user.js';
import common from './common.js';

export default combineReducers ({
    user,
    movie,
    common
})