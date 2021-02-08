import React from "react";
import {Card, ListGroup} from "react-bootstrap";

const CommentItem = ({data}) => {
    const {login, commentary} = data;
    return (
        <>
            <Card>
                <Card.Header>{login}</Card.Header>
                <Card.Body>
                    <blockquote className="blockquote mb-0">
                        <footer className="blockquote-footer">
                           <cite title="Source Title">{commentary}</cite>
                        </footer>
                    </blockquote>
                </Card.Body>
            </Card>
        </>
    )
};

export default CommentItem;