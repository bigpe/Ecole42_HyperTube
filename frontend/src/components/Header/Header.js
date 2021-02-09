import React from "react";
import {Button, Col, Nav, Navbar} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {userLogOut} from "../../actions/user";
import {Link} from "react-router-dom";
import {lang} from '../../utils/location';
import {getGetRequest} from "../../utils/api";
import {useHistory} from "react-router-dom";

const Header = ({langv}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const logOut = () => {

        getGetRequest('/user/logout/')
            .then((res) => {
            });
        dispatch(userLogOut());
        history.push('/');
    }

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-5">
                        <Col><Link to="/">Hypertube </Link></Col>
                        <Col><Link to="/search">{lang[langv].search}</Link></Col>
                        <Col><Link to="/profile">{lang[langv].user}</Link></Col>
                    </Nav>
                </Navbar.Collapse>
                <Button onClick={logOut}>{lang[langv].logOut}</Button>
            </Navbar>
        </>
    );
}

export default Header;