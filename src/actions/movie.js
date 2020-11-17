import {
    GENRE_MOVIE_REQUEST,
    GENRE_MOVIE_SUCCESS,
    MOVIE_BY_GENRE_SUCCESS,
    MOVIE_BY_GENRE_REQUEST,
    MOVIE_BY_ID_REQUEST,
    MOVIE_BY_ID_SUCCESS,
    MOVIE_BY_ID_TORRENT_SUCCESS,
    MOVIE_BY_ID_TORRENT_REQUEST
} from "../constants/actions/movie";
import {getRequest} from "../utils/api";

export const getGenreRequest = () => ({ type: GENRE_MOVIE_REQUEST});

export const genreMovieSuccess = movie => dispatch => dispatch({
    type: GENRE_MOVIE_SUCCESS,
    payload: movie
})

export const MovieByGenreRequest = (genre) => dispatch => dispatch({
    type: MOVIE_BY_GENRE_REQUEST,
    payload: {title: genre}});

export const MovieByGenreRequestSuccess = (movie, title) => dispatch => dispatch({
    type: MOVIE_BY_GENRE_SUCCESS,
    payload: {movie, title}
})

export const getGenre = () => (dispatch) => {
    dispatch(getGenreRequest());
    getRequest('/genres/')
        .then(res => dispatch(genreMovieSuccess(res.data)));
}

export const getMovieByGenre = (genre) => (dispatch) => {
    dispatch(MovieByGenreRequest(genre));
    getRequest('/movies/',
    {
        limit: 7,
        page:1,
        quality: 'all',
        genre: genre,
        sort_by: 'rating'
    })
        .then(res => dispatch(MovieByGenreRequestSuccess(res.data, genre)));
}

export const movieByIdRequest = () => ({ type: MOVIE_BY_ID_REQUEST});


export const movieByIdSuccess = movie => dispatch => dispatch({
        type: MOVIE_BY_ID_SUCCESS,
        payload: movie
    });

export const getUrlMovieRequest = () => ({ type: MOVIE_BY_ID_TORRENT_REQUEST});
export const getUrlMovieSuccess = url => dispatch => dispatch({
    type: MOVIE_BY_ID_TORRENT_SUCCESS,
    payload: url
});

export const getMovieById = (id) => (dispatch) => {
    dispatch(movieByIdRequest());
    getRequest('/movie/', {movie_id: id})
        .then(res => {
            dispatch(movieByIdSuccess(res.data));
            dispatch(getUrlMovieRequest());
            getRequest('/movie/start/', { "torrentHash" : res.data.torrents[1].hash })
                .then(r => dispatch(getUrlMovieSuccess(r.data)))
        })
}