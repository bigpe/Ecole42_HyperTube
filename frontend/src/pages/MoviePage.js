import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {
    getMovieById,
    getUrlMovieSuccess, setHashMovie,
} from "../actions/movie";
import {
    CurrentMovieSelector,
    LoadingMovieSelector, movieHashSelector,
    MovieReadyProgressSelector,
    MovieReadySelector, videoPathSelector
} from "../selectors/movie";
import { Button, CardGroup, Col, Container, Image, Row, Form } from "react-bootstrap";
import MediaElement from "../components/MediaElement/MediaElement";
import Actor from "../components/Actor";
import Comments from "../components/Comments";
import { getRequest } from "../utils/api";

const MoviePage = ({curMovie, loading, location, movieReady, videoPath, progress}) => {
    const dispatch = useDispatch();
    const [error, setError] = useState("success");
    const [quality, setQuality] = useState('');
    const [sources, setSources] = useState('');

    const movieId = location.search.slice(1);
    let trackF = {
        en: {label: 'English', lang: 'English', kind: "subtitles",},
        fr: {label: 'French', lang: 'French', kind: "subtitles",},
        ru: {label: 'Russian', lang: 'Russian', kind: "subtitles",},
    };
    const config = {features: ['playpause', 'current', 'progress', 'duration', 'volume', 'tracks', 'settings', 'fullscreen']};
    const trackArr = curMovie?.movie?.subs?.map(track => {
        const lang = Object.keys(track)[0];
        return ({
            label: trackF[lang].label,
            lang: trackF[lang].lang,
            kind: "subtitles",
            src: track[lang],
        })
    });
    console.log(progress);
    const onError = (er) => setError(er);
    const tryAgain = () => setError("success");
    const qualityHandler = (e) => {
        setQuality(e.target.value)
        getRequest('/movie/start/', {"torrentHash": e.target.value})
            .then(r => {
                dispatch(getUrlMovieSuccess(r.data))
                dispatch(setHashMovie(e.target.value));
            })
    };

    useEffect(() => {
        dispatch(getMovieById(movieId))
    }, []);
    useEffect(() => {
        setSources([{src: movieReady && `${window.location.origin}/${videoPath}`, type: 'video/mp4'}])
    }, [videoPath]);
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

                    {error !== "error" && trackArr ? (
                        <>
                            <Form.Control
                                as="select"
                                className="w-25"
                                id="inlineFormCustomSelectPref"
                                custom
                                value={quality}
                                onChange={qualityHandler}
                            >
                                {curMovie?.movie?.torrents.length > 0 && curMovie?.movie?.torrents.map((item) => (
                                    <option value={item.hash}>{item.quality}</option>

                                ))}
                            </Form.Control>
                            <MediaElement
                                onErr={onError}
                                id={sources[0].src}
                                preload="none"
                                controls
                                width="100%"
                                height="360"
                                poster={curMovie.movie.background_image_original}
                                sources={sources}
                                options={config}
                                tracks={trackArr}
                            />
                        </>

                    ) : (
                        <>
                            <h2>Sorry! Something went wrong</h2>
                            <h3>Progress downloads {!!progress && progress}</h3>
                            <Button onClick={tryAgain}>Try again</Button>
                        </>
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
            <Row>
                <Col className="col-sm col-lg m-5">
                    <h1>Comments</h1>
                    <Comments
                        data={curMovie.movie.cum}
                        IMDBid={curMovie.movie.imdb_code}
                    />
                </Col>
            </Row>
        </Container>
    )
};

const mapStateToProps = state => ({
    curMovie: CurrentMovieSelector(state),
    videoPath: videoPathSelector(state),
    loading: LoadingMovieSelector(state),
    hash: movieHashSelector(state),
    movieReady: MovieReadySelector(state),
    progress: MovieReadyProgressSelector(state),
})

export default connect(mapStateToProps)(MoviePage);