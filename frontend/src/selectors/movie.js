export const MovieSelector = state => state.movie;
export const GenreSelector = state => state.movie.genreMovie;
export const GenreLoadSelector = state => state.movie.loadingGenre;

export const MovieLoad = state => state.movie.movieLoad;
export const MovieListSelector = (state, title) => state.movie[title];
export const StateSelector = state => state;
export const CurrentMovieSelector = state => state.movie.curMovie;
export const LoadingMovieSelector = state => state.movie.curMovie.loading;
export const MovieReadySelector = state => state.movie.curMovie.ready;
export const MovieSearchSelector = state => state.movie.searchMovie;

