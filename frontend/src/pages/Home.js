import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {GenreSelector} from "../selectors/movie";
import {getGenre} from "../actions/movie";
import {Container} from "react-bootstrap";
import Genre from "../components/Genre/Genre";
import {LangSelector} from "../selectors/common";

const Home = ({genre, langv}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (!genre.length) dispatch(getGenre(langv === 'ru' ? 'ru-RU' : 'eng'));
    }, [genre])

    return (
        <Container fluid className="justify-content-center">
            {!!genre.length && genre.map(item => (<Genre title={item.name} genreKey={item.name}/>))}
        </Container>
    )
}

const mapStateToProps = (state) => ({
    genre: GenreSelector(state),
    langv: LangSelector(state),
});

export default connect(mapStateToProps)(Home);