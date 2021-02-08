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
    MOVIE_BY_ID_TORRENT_SUCCESS, MOVIE_BY_ID_TORRENT_READY, MOVIE_ADD_SUB, MOVIE_GET_CUM, MOVIE_CHANGE_HASH
} from '../constants/actions/movie';

const initialState = {
    genreMovie: [],
    error: '',
    curMovie: {
        loading: false,
        ready: false,
        urlTorr: {
            videoPath: ''
        },
        hash: '',
    }
}

const movie = (state = initialState, action) => {
    if (action.type === SEARCH_MOVIE_SUCCESS) console.log(action);
    switch (action.type) {
        case GENRE_MOVIE_REQUEST:
            return {
                ...state,
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
            return {
                ...state,
                loading: true
            };
        case SEARCH_MOVIE_SUCCESS:
            return {
                ...state,
                loading: false,
                searchMovie: {
                    ...state.searchMovie,
                    [action.payload.page]:
                        {
                            search: action.payload.movies.data,
                            message: action.payload.movies.message
                        }
                },
                error: ''
            };
        case MOVIE_BY_GENRE_REQUEST:
            return {
                ...state,
                [action.payload.title]: {movieLoad: false}
            };
        case MOVIE_BY_GENRE_SUCCESS:
            return {
                ...state,
                [action.payload.title]: {
                    movie: action.payload.movie,
                    movieLoad: true,
                },
                error: ''
            };
        case MOVIE_BY_ID_REQUEST:
            return {
                ...state,
                curMovie: {...state.curMovie, loading: false}
            };
        case MOVIE_BY_ID_SUCCESS:
            return {
                ...state,
                curMovie: {
                    ...state.curMovie,
                    loading: true,
                    movie: action.payload,
                    hash: action.payload.torrents[0].hash
                }
            };
        case MOVIE_CHANGE_HASH:
            return {
                ...state,
                curMovie: {
                    ...state.curMovie,
                    hash: action.payload,
                }
            };
        case MOVIE_BY_ID_TORRENT_REQUEST:
            return {
                ...state,
                curMovie: {...state.curMovie, ready: false}
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
                    movie: {...state.curMovie.movie, subs: action.payload.subtitlesPath},
                }
            };
        case MOVIE_GET_CUM:
            return {
                ...state,
                curMovie: {
                    ...state.curMovie,
                    movie: {...state.curMovie.movie, cum: action.payload},
                }
            };
        default:
            return state;
    }
}

export default movie;