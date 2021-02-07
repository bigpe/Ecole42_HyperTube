import {
    SEARCH_MOVIE_REQUEST, SEARCH_MOVIE_SUCCESS,
    GENRE_MOVIE_REQUEST, GENRE_MOVIE_SUCCESS,
    MOVIE_BY_GENRE_SUCCESS, MOVIE_BY_GENRE_REQUEST,
    MOVIE_BY_ID_REQUEST, MOVIE_BY_ID_SUCCESS,
    MOVIE_BY_ID_TORRENT_SUCCESS, MOVIE_BY_ID_TORRENT_REQUEST,
    MOVIE_BY_ID_TORRENT_READY
} from "../constants/actions/movie";
import {getRequest} from "../utils/api";

export const getGenreRequest = () => ({ type: GENRE_MOVIE_REQUEST});

export const genreMovieSuccess = movie => dispatch => dispatch({
    type: GENRE_MOVIE_SUCCESS,
    payload: movie
})
export const getSearchRequest = (query) => dispatch => dispatch({ type: SEARCH_MOVIE_REQUEST, payload: query });

export const SearchSuccess = movie => dispatch => dispatch({
    type: SEARCH_MOVIE_SUCCESS,
    payload: movie
})

export const MovieByGenreRequest = (genre) => dispatch => dispatch({
    type: MOVIE_BY_GENRE_REQUEST,
    payload: {title: genre}});

export const MovieByGenreRequestSuccess = (movie, title) => dispatch => dispatch({
    type: MOVIE_BY_GENRE_SUCCESS,
    payload: {movie, title}
})

export const getGenre = (lang) => (dispatch) => {
    dispatch(getGenreRequest());
    getRequest('/genres/', {language: lang})
        .then(res => dispatch(genreMovieSuccess(res.data.data)));
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
        .then(res => dispatch(MovieByGenreRequestSuccess(res.data.data, genre)));
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
export const getUrlMovieReady = url => dispatch => dispatch({
    type: MOVIE_BY_ID_TORRENT_READY,
    payload: url
});

export const getMovieById = id => dispatch => {
    dispatch(movieByIdRequest());
    getRequest('/movie/', {movie_id: id, with_images:"true", with_cast:"true"})
        .then(res => {
            dispatch(movieByIdSuccess(res.data.data));
            dispatch(getUrlMovieRequest());
            getRequest('/movie/start/', { "torrentHash" : res.data.data.torrents[0].hash })
                .then(r => {
                    getRequest('/movie/status/', { "torrentHash" : res.data.data.torrents[0].hash })
                        .then(response => dispatch(getUrlMovieReady(response.data)))
                    return dispatch(getUrlMovieSuccess(r.data))
                })
        })
}

export const getSearch = ({sort_by = "date_added", query = '', genre = '', rating = 0}) => dispatch => {
    dispatch(getSearchRequest(query));
    getRequest('/movies/', {
        limit: 20,
        page:1,
        quality:"all",
        sort_by: sort_by,
        order_by:"desc",
        with_rt_ratings: false,
        query_term: query,
        genre,
        minimum_rating: Math.floor(rating/10),
    })
        .then(res => dispatch(SearchSuccess(res.data)));
}
