import React from "react";

const SearchList = () => {
    const movieList = [{id: 3, title: "movie"}];
    return (
        <div>
            {movieList.length && movieList.map(movie => <Movie movie={movie} />)}
        </div>
    )
}
export default SearchList;