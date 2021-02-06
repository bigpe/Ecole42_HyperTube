import { Button, Col, Image, Row, useAccordionToggle } from "react-bootstrap";
import { Link } from "react-router-dom";
import MediaElement from "../MediaElement/MediaElement";
import React, {useState} from "react";


const AccordionMovie = ({ children, eventKey, setCardBody }) => {
    const [error, setError] = useState("success");
    const decoratedOnClick = useAccordionToggle(eventKey, () => {
    const onError = (er) => setError(er);
        const sources = [
                {src: `https://www.youtube.com/watch?v=${children.yt_trailer_code}`, type: 'video/x-youtube'},
            ],
            config = {autoplay: true, mute: true, controls: ""},
            tracks = {};

        const innerBody = () => (
            <Row>
                <Col>
                    <h1>{children.title}</h1>
                    <p>{children.description_full}</p>
                    <Link to={`/movie/?${children.id}`}><Button>Watch</Button></Link>
                </Col>
                <Col>
                    {children.yt_trailer_code && error === "success" ?
                        (
                            <MediaElement
                                onErr={onError}
                                id={`movie${children.id}`}
                                mediaType="video"
                                preload="none"
                                controls
                                width="640"
                                height="360"
                                poster=""
                                sources={JSON.stringify(sources)}
                                options={JSON.stringify(config)}
                                tracks={JSON.stringify(tracks)}
                        />
                        ) : (
                            <Image
                                src={children.background_image_original}
                            />
                            )}
                </Col>
            </Row>
        );
        setCardBody(innerBody())
    });

    return (<Image src={children.medium_cover_image} onClick={decoratedOnClick}/>);
}

export default AccordionMovie;