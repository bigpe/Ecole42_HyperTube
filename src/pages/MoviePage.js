import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {getMovieById} from "../actions/movie";
import {CurrentMovieSelector} from "../selectors/movie";

const SearchPage = ({curMovie, location}) => {
    const dispatch = useDispatch();
    const movieId= location.search.slice(1)
    console.log(movieId, location);
    useEffect(()=> {
        dispatch(getMovieById(movieId))
    }, [movieId])

    return(
            <h1></h1>
    )
};

const mapStateToProps = state => ({
    curMovie: CurrentMovieSelector(state)
})

export default connect(mapStateToProps)(SearchPage);