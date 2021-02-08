import React from "react";
import { connect } from "react-redux";
import { MovieSearchSelector } from "../../selectors/movie";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const SearchList = ({movieList, page}) => {
    console.log(movieList);
    return (
        <div>
            {movieList && movieList[page] && movieList[page]?.search?.length && movieList[page]?.search.map(movie => <Link to={`/movie/?${movie.id}`}><Image className="ml-5" src={movie.medium_cover_image} /></Link>)}
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