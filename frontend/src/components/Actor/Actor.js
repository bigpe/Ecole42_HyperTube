import React from "react";
import { Card, Col } from "react-bootstrap";

const Actor = ({character_name, imdb_code, name, url_small_image}) => (
    <Card className="w-auto">
        { url_small_image ? (
            <Card.Img variant="top"  className="w-30" src={url_small_image} alt={name}/>
            )
        :
            (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                    <path
                          d="M 11 3 A 3.9999902 4.0000296 0 0 0 7 7 A 3.9999902 4.0000296 0 0 0 11 11 A 3.9999902 4.0000296 0 0 0 15 7 A 3.9999902 4.0000296 0 0 0 11 3 z M 11 4 A 3 3.0000296 0 0 1 14 7 A 3 3.0000296 0 0 1 11 10 A 3 3.0000296 0 0 1 8 7 A 3 3.0000296 0 0 1 11 4 z M 11 12 A 7.9999504 8.0000296 0 0 0 3.0722656 19 L 4.0800781 19 A 6.9999604 7.0000296 0 0 1 11 13 A 6.9999604 7.0000296 0 0 1 17.921875 19 L 18.929688 19 A 7.9999504 8.0000296 0 0 0 11 12 z "
                          className="ColorScheme-Text"/>
                </svg>
            )
        }
        <Card.Body>
            <Card.Text>
                {`${name}(${character_name})`}
            </Card.Text>
        </Card.Body>
    </Card>
);

export default Actor;