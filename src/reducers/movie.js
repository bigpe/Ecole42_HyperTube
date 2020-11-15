import {
    GENRE_MOVIE_REQUEST, GENRE_MOVIE_SUCCESS, MOVIE_BY_GENRE_SUCCESS, MOVIE_BY_GENRE_REQUEST, MOVIE_BY_ID_SUCCESS, MOVIE_BY_ID_REQUEST
} from '../constants/actions/movie';

const initialState = {
    genreMovie: [],
    error: ''
}

const movie = (state= initialState, action) => {
    switch (action.type){
        case GENRE_MOVIE_REQUEST:
            return { ...state,
                loadingGenre: false
            };
        case GENRE_MOVIE_SUCCESS:
            return {
                ...state,
                loadingGenre: true,
                genreMovie: action.payload,
                error: ''
            };
        case MOVIE_BY_GENRE_REQUEST:
            return {
                ...state,
                [action.payload.title]: { movieLoad: false }
            };
        case MOVIE_BY_GENRE_SUCCESS:
            return {
                ...state,
                [action.payload.title]: { movie: action.payload.movie,
                    movieLoad: true,} ,
                error: ''
            };
        case MOVIE_BY_ID_REQUEST:
            return {
                ...state,
                curMovie: { loading: false }
            };
        case MOVIE_BY_GENRE_SUCCESS:
            return {
                ...state,
                curMovie: { loading: true,
                    movie: action.payload.movie,
                }
            };
        default: return state;
    }
}

export default movie;