import {
    SEARCH_MOVIE_REQUEST, SEARCH_MOVIE_SUCCESS,
    GENRE_MOVIE_REQUEST, GENRE_MOVIE_SUCCESS,
    MOVIE_BY_GENRE_SUCCESS, MOVIE_BY_GENRE_REQUEST,
    MOVIE_BY_ID_REQUEST, MOVIE_BY_ID_SUCCESS,
    MOVIE_BY_ID_TORRENT_SUCCESS, MOVIE_BY_ID_TORRENT_REQUEST,
    MOVIE_BY_ID_TORRENT_READY, MOVIE_ADD_SUB, MOVIE_GET_CUM, MOVIE_SET_CUM_REQ, MOVIE_SET_CUM_SUC, MOVIE_CHANGE_HASH
} from "../constants/actions/movie";
import {getPutRequest, getRequest} from "../utils/api";

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
export const setSubtitles = sub => dispatch => dispatch({
    type: MOVIE_ADD_SUB,
    payload: sub
});
export const getCommentaries = cum => dispatch => dispatch({
    type: MOVIE_GET_CUM,
    payload: cum.data
});
export const setCommentariesRequest = cum => dispatch => dispatch({
    type: MOVIE_SET_CUM_REQ,
    payload: cum
});
export const setCommentariesSuccess = cum => dispatch => dispatch({
    type: MOVIE_SET_CUM_SUC,
    payload: cum
});
export const setHashMovie = hash => dispatch => dispatch({
    type: MOVIE_CHANGE_HASH,
    payload: hash
});

export const getMovieById = (id) => dispatch => {
    dispatch(setCommentariesRequest());
    getRequest('/movie/', {movie_id: id, with_images:"true", with_cast:"true"})
        .then(res => {
            dispatch(movieByIdSuccess(res.data.data));
            dispatch(getUrlMovieRequest());
            getRequest('/movie/start/', { "torrentHash" : res.data.data.torrents[0].hash })
                .then(r => {
                    getRequest(`/movie/subtitles/`, {"IMDBid": res.data.data.imdb_code})
                        .then(response => dispatch(setSubtitles(response.data)));
                    getRequest(`/movie/commentaries/`, {"IMDBid": res.data.data.imdb_code})
                        .then(response => dispatch(getCommentaries(response.data)));
                    getRequest('/movie/status/', { "torrentHash" : res.data.data.torrents[0].hash })
                        .then(response => dispatch(getUrlMovieReady(response.data)))
                    return dispatch(getUrlMovieSuccess(r.data));
                })
        })
}
export const setComments = (opt) => dispatch => {
    getPutRequest(`/commentary/`, opt)
        .then((res) => {
            getRequest(`/movie/commentaries/`, {"IMDBid": opt.IMDBid})
                .then(response => {
                    dispatch(setCommentariesSuccess(response.data))
                    dispatch(getCommentaries(response.data));
                });
    })
}
export const getSearch = ({sort_by = "date_added", query = '', genre = '', rating = 0, page = 1}) => dispatch => {
    dispatch(getSearchRequest(query));
    debugger;
    getRequest('/movies/', {
        limit: 20,
        page,
        quality:"all",
        sort_by: sort_by,
        order_by:"desc",
        with_rt_ratings: false,
        query_term: query,
        genre,
        minimum_rating: Math.floor(rating/10),
    })
        .then(res => dispatch(SearchSuccess({movies: res.data, page})));
}

