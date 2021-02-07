import {
    SEARCH_MOVIE_SUCCESS,
    SEARCH_MOVIE_REQUEST,
    GENRE_MOVIE_REQUEST,
    GENRE_MOVIE_SUCCESS,
    MOVIE_BY_GENRE_SUCCESS,
    MOVIE_BY_GENRE_REQUEST,
    MOVIE_BY_ID_SUCCESS,
    MOVIE_BY_ID_REQUEST,
    MOVIE_BY_ID_TORRENT_REQUEST,
    MOVIE_BY_ID_TORRENT_SUCCESS, MOVIE_BY_ID_TORRENT_READY, MOVIE_ADD_SUB
} from '../constants/actions/movie';

const initialState = {
    genreMovie: [],
    error: '',
    curMovie: {
        loading: false,
        ready: false
    }
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
        case SEARCH_MOVIE_REQUEST:
            return { ...state,
                loading: true
            };
        case SEARCH_MOVIE_SUCCESS:
            return {
                ...state,
                loading: false,
                searchMovie: { search: action.payload.data, message: action.payload.message },
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
                curMovie: { ...state.curMovie, loading: false }
            };
        case MOVIE_BY_ID_SUCCESS:
            return {
                ...state,
                curMovie: {
                    ...state.curMovie,
                    loading: true,
                    movie: action.payload,
                }
            };
        case MOVIE_BY_ID_TORRENT_REQUEST:
            return {
                ...state,
                curMovie: { ...state.curMovie, ready: false }
            };
        case MOVIE_BY_ID_TORRENT_SUCCESS:
            return {
                ...state,
                curMovie: {
                    ...state.curMovie,
                    ready: true,
                    urlTorr: action.payload
                }
            };
            case MOVIE_BY_ID_TORRENT_READY:
            return {
                ...state,
                curMovie: {
                    ...state.curMovie,
                    readyMovie: action.payload,
                }
            };
            case MOVIE_ADD_SUB:
            return {
                ...state,
                curMovie: {
                    ...state.curMovie,
                    movie: {...state.curMovie.movie, subs: action.payload},
                }
            };
        default: return state;
    }
}

export default movie;