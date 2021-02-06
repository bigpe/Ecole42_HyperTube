import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {GenreSelector, MovieSelector} from "../selectors/movie";
import {getGenre} from "../actions/movie";
import {Container, Modal} from "react-bootstrap";
import Genre from "../components/Genre/Genre";

const Home = ({genre}) => {
    const dispatch = useDispatch();
    const [lgShow, setLgShow] = useState(false);

    useEffect(() => {
        if(!genre.length) dispatch(getGenre('ru-RU'));
    }, [])

    return (
        <Container fluid className="justify-content-center">
            {
                !!genre.length &&
                    <Genre title={genre[0].name} genreKey={1}/>
            }
        </Container>
    )
}

const mapStateToProps = (state) => ({
    movie: MovieSelector(state),
    genre: GenreSelector(state),
});

export default connect(mapStateToProps)(Home);