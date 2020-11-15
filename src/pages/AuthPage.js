import React from "react";
import {Button} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {userLogIn} from "../actions/user";

const AuthPage = () => {
    const dispatch = useDispatch();
    return (
        <>
            <h1>Need auth</h1>
            <Button onClick={() => dispatch(userLogIn())}>Log in </Button>
        </>
    );
}
export default AuthPage;