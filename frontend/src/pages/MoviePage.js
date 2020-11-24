import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {getMovieById} from "../actions/movie";
import {CurrentMovieSelector, LoadingMovieSelector, MovieReadySelector} from "../selectors/movie";
import {Col, Container, Image, Row} from "react-bootstrap";
import MediaElement from "../components/MediaElement/MediaElement";

const SearchPage = ({curMovie, loading, location, movieReady}) => {
    const dispatch = useDispatch();
    const movieId= location.search.slice(1)
    useEffect(()=> {
        dispatch(getMovieById(movieId))
    }, [movieId])
    const
        sources = [
            {src: movieReady && `http://0.0.0.0:5006/${curMovie.urlTorr.videoPath}`, type: 'video/mp4'},
        ],
        config = {autoplay: true, mute: true, controls: ""},
        tracks = {}
    return loading && movieReady && (
        <Container class="justify-content-center align-items-center">
            <Row>
                <Col class="col-sm">
                    <h1>{curMovie.movie.title}</h1>
                    <Image src={curMovie.movie.background_image_original}/>
                    <p>{curMovie.movie.description_full}</p>
                </Col>
                <Col class="col-sm"x>
                <MediaElement 		  id="player1"
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
        </Container>)
};

const mapStateToProps = state => ({
    curMovie: CurrentMovieSelector(state),
    loading: LoadingMovieSelector(state),
    movieReady: MovieReadySelector(state),
})

export default connect(mapStateToProps)(SearchPage);