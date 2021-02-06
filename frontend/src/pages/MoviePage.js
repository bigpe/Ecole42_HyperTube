import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { getMovieById } from "../actions/movie";
import {
    CurrentMovieSelector,
    LoadingMovieSelector,
    MovieReadyProgressSelector,
    MovieReadySelector
} from "../selectors/movie";
import { CardGroup, Col, Container, Image, Row } from "react-bootstrap";
import MediaElement from "../components/MediaElement/MediaElement";
import Actor from "../components/Actor";

const SearchPage = ({ curMovie, loading, location, movieReady }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState("success");
    const onError = (er) => setError(er);
    const movieId= location.search.slice(1);
    const
        sources = [
            { src: movieReady && `http://localhost:5006/${curMovie.urlTorr.videoPath}`, type: 'video/mp4' },
        ],
        config = { features: ['playpause', 'current', 'progress', 'duration', 'volume', 'tracks','settings', 'fullscreen']},
        tracks = movieReady && curMovie.urlTorr.subtitlesPath ? [{
            src: `${window.location}${curMovie.urlTorr.subtitlesPath}`,
            label:'English',
            lang:"English",
            kind:"subtitles",
    }] : [];

    useEffect(()=> {
        dispatch(getMovieById(movieId))
    }, [movieId]);

    return loading && movieReady && (
        <Container className="justify-content-center align-items-center">
            <Row>
                <Col className="col-sm ">
                    <h1>{curMovie.movie.title_long}</h1>
                    <Image className="mr-0" src={curMovie.movie.medium_cover_image}/>
                </Col>
                <Col className="col-sm mt-5 ml-0">
                    <p>{curMovie.movie.description_full}</p>
                </Col>
                <Col className="col-sm mt-5 ml-0">
                    <h3>IMDB rating: {curMovie.movie.rating}</h3>
                </Col>
            </Row>
            <Row>
                <Col className="col-sm col-lg m-5">
                    { error !== "error" ? (
                    <MediaElement
                        onErr={onError}
                        id="player1"
                        mediaType="video"
                        preload="none"
                        controls
                        width="100%"
                        height="360"
                        poster={curMovie.movie.background_image_original}
                        sources={JSON.stringify(sources)}
                        options={JSON.stringify(config)}
                        tracks={JSON.stringify(tracks)}
                    />
                    ) : (
                        <h2>Sorry! Something went wrong</h2>
                    )}
                </Col>
            </Row>
            <Row>
                <Col className="col-sm col-lg m-5">
                    <h1>Cast</h1>
                    <CardGroup className="w-50">
                    {curMovie.movie.cast?.map((actor, i) =>
                        (
                            <Actor key={i}
                                character_name={actor.character_name}
                                imdb_code={actor.imdb_code}
                                name={actor.name}
                                url_small_image={actor.url_small_image}
                            />
                    ))}
                    </CardGroup>
                </Col>
            </Row>
        </Container>
    )
};

const mapStateToProps = state => ({
    curMovie: CurrentMovieSelector(state),
    loading: LoadingMovieSelector(state),
    movieReady: MovieReadySelector(state),
    progress: MovieReadyProgressSelector(state),
})

export default connect(mapStateToProps)(SearchPage);