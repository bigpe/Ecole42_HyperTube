import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {getMovieById} from "../actions/movie";
import {CurrentMovieSelector} from "../selectors/movie";

const SearchPage = ({curMovie, location}) => {
    const dispatch = useDispatch();
    const movieId= location.search.slice(1)

    useEffect(()=> {
        dispatch(getMovieById(movieId))
    }, [movieId])

    console.log(curMovie);
    return(
            <h1></h1>
    )
};

const mapStateToProps = state => ({
    curMovie: CurrentMovieSelector(state)
})

export default connect(mapStateToProps)(SearchPage);