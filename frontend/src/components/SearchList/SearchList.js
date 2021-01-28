import React from "react";
import { connect } from "react-redux";
import { MovieSearchSelector } from "../../selectors/movie";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown'

const SearchList = ({movieList}) => {
    console.log(movieList);
    return (
        <div>
            {movieList?.search?.length && movieList.search.map(movie => <Link to={`/movie/?${movie.id}`}><Image class="ml-5" src={movie.medium_cover_image} /></Link>)}
            {movieList?.message === "Success" && !movieList.search?.length &&
            (<p>No results</p>)
            }
        </div>
    )
};

const mapStateToProps = state => ({
    movieList: MovieSearchSelector(state)
})

export default connect(mapStateToProps)(SearchList);