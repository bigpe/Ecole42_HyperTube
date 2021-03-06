import {Badge, Button, Col, Image, Row, useAccordionToggle} from "react-bootstrap";
import { Link } from "react-router-dom";
import MediaElement from "../MediaElement/MediaElement";
import React, {useState} from "react";
import {lang} from "../../utils/location";


const AccordionMovie = ({ children, eventKey, id, setCardBody, viewed, langv }) => {
    const [error, setError] = useState("success");
    const [sources, setSources] = useState([{src: `https://www.youtube.com/watch?v=${children.yt_trailer_code}`, type: 'video/x-youtube'},
    ]);
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
    const onError = (er) => setError(er);
        const config = {autoplay: true, mute: true, controls: ""},
            tracks = {};
        const innerBody = () => {

            return (
                <Row>
                    <Col>
                        <h1>{children.title} ({children.year})</h1>
                        {!!children.watched && (<Badge variant="success">{lang[langv].viewed}</Badge>)}
                        <p>{children.description_full}</p>
                        <Link to={`/film/?${children.id}`}><Button>Watch</Button></Link>
                    </Col>
                    <Col>
                        {children.yt_trailer_code && error === "success" ?
                            (
                                <MediaElement
                                    onErr={onError}
                                    id={`movie${id}`}
                                    mediaType="video"
                                    preload="none"
                                    controls
                                    width="640"
                                    height="360"
                                    poster=""
                                    sources={sources}
                                    options={config}
                                    tracks={tracks}
                                />
                            ) : (
                                <Image
                                    src={children.background_image_original}
                                />
                            )}
                    </Col>
                </Row>
            )
        };
        setCardBody(innerBody)
    });
    return (<Image src={children.medium_cover_image} onClick={decoratedOnClick}/>);
}

export default AccordionMovie;