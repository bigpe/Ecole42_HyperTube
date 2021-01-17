import React from "react";
import { connect } from "react-redux";
import { MovieSearchSelector } from "../../selectors/movie";

const SearchList = ({movieList}) => {
    console.log(movieList);
    return (
        <div>
            {movieList?.length && movieList.map(movie => <div> {movie.title}</div>)}
        </div>
    )
};

const mapStateToProps = state => ({
    movieList: MovieSearchSelector(state)
})

export default connect(mapStateToProps)(SearchList);