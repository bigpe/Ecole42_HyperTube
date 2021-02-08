import React, {useEffect, useState} from "react";
import {Input} from "reactstrap";
import {Button, Row} from "react-bootstrap";
import {setComments} from "../../actions/movie";
import {useDispatch} from "react-redux";
import CommentItem from "../CommentItem";

const Comments = ({data, IMDBid}) => {
    const dispatch = useDispatch();
    const [text, setText] = useState('');
    const inputHandler = (e) => setText(e.target.value)
    const buttonHandler = (text) => dispatch(setComments({commentary: text, IMDBid}));
    return (
        <>
            {data?.length && data?.map((cum, i) => (
                <CommentItem key={i} data={cum} />
            ))}
            <Row className="mt-2"><Input className="w-75" value={text} onChange={inputHandler}/>
            <Button className="w-25" onClick={()=> buttonHandler(text)}>Send</Button>
            </Row>
        </>
    )
}

export default Comments;