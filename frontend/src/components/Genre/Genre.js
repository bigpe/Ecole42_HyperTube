import React, {useEffect, useState} from "react";
import {getMovieByGenre} from "../../actions/movie";
import {connect, useDispatch} from "react-redux";
import {GenreLoadSelector, StateSelector} from "../../selectors/movie";
import {Image, Spinner, Col, Row, Accordion, Card, useAccordionToggle, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import ReactPlayer from 'react-player'
import MediaElement from "../MediaElement/MediaElement";

const Genre = ({title, genreKey, state, genreLoad}) => {
    const dispatch = useDispatch();
    const movieList = state.movie[title];
    const [cardBody, setCardBody] = useState('');

    const CustomToggle = ({ children, eventKey }) => {
        const decoratedOnClick = useAccordionToggle(eventKey, () => {
            const
                sources = [
                        {src: `http://www.youtube.com/watch?v=${children.yt_trailer_code}`, type: 'video/x-youtube'},
                ],
                config = {autoplay: true, mute: true, controls: ""},
                tracks = {}
            ;
            const innerBody = () => (
                <Row>
                    <Col>
                        <h1>{children.title}</h1>
                        <Link to={`/movie/?${children.id}`}><Button>Watch</Button></Link>
                    </Col>
                    <Col>
                    <MediaElement 		  id="children.id"
                                               mediaType="video"
                                               preload="none"
                                               controls
                                               width="640"
                                               height="360"
                                               poster=""
                                               sources={JSON.stringify(sources)}
                                               options={JSON.stringify(config)}
                                               tracks={JSON.stringify(tracks)}/>
                    </Col>
                </Row>
            )
            setCardBody(innerBody())
        });
        return (
            <Image src={children.medium_cover_image} onClick={decoratedOnClick}/>
        );
    }

    useEffect(() => {
        if (!movieList) dispatch(getMovieByGenre(title))
    }, []);

    if (movieList) return (
        <>
            <Accordion defaultActiveKey="0">
                <Card>
                <Card.Header>
                    <Row className><h2>{title}</h2></Row>
                </Card.Header>
                    <Row className="justify-content-between">
                        {
                            !!movieList.movieLoad && movieList.movie.map((movie, i) => (
                            <Col key={i} className="py-2 px-0 mx-1">
                                    <CustomToggle key={i} eventKey={genreKey} >
                                        { movie }
                                    </CustomToggle>
                            </Col>
                            ))
                        }
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
    genreLoad: GenreLoadSelector(state)
})

export default connect(mapStateToProps)(Genre);
