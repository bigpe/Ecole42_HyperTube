import React, { useEffect, useState } from "react";
import { getMovieByGenre } from "../../actions/movie";
import { connect, useDispatch } from "react-redux";
import { GenreLoadSelector, StateSelector } from "../../selectors/movie";
import {Spinner, Col, Row, Accordion, Card, Carousel} from "react-bootstrap";
import { lang } from '../../utils/location';
import AccordionMovie from "../AccordionMovie";
import { LangSelector }  from "../../selectors/common";

const Genre = ({ title, genreKey, state, langv }) => {
    const dispatch = useDispatch();
    const [cardBody, setCardBody] = useState('');

    const movieList = state.movie[langv ==="ru" ? lang[langv].genreRuEng[title] : title];

    useEffect(() => {
        if (!movieList) dispatch(getMovieByGenre(langv === "ru" ? lang[langv].genreRuEng[title] : title))
    }, []);

    if (movieList) return (
        <>
            <Accordion defaultActiveKey="0">
                <Card>
                <Card.Header>
                    <Row className><h2>{title}</h2></Row>
                </Card.Header>
                    <Row className="justify-content-between overflow-auto flex-nowrap">
                        {!!movieList.movieLoad && movieList.movie?.map((movie, i) => (
                            <Col key={i} className="py-2 px-0 mx-1">
                                    <AccordionMovie key={i} eventKey={genreKey} id={movie.id} setCardBody={setCardBody} viewed={i%3} langv={langv}>
                                        { movie }
                                    </AccordionMovie>
                            </Col>
                        ))}
                    </Row>
                    <Accordion.Collapse eventKey={genreKey}>
                        <Card.Body>{cardBody}</Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </>
    );
    else return (<Spinner animation="grow"/>)
}

const mapStateToProps = state => ({
    state: StateSelector(state),
    genreLoad: GenreLoadSelector(state),
    langv: LangSelector(state),
})

export default connect(mapStateToProps)(Genre);
