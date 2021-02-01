import React from "react";
import { Button, Dropdown, FormControl, InputGroup, Nav, Navbar } from "react-bootstrap";
import {useDispatch} from "react-redux";
import {userLogOut} from "../../actions/user";
import { Link } from "react-router-dom";
import { lang } from '../../utils/location';

const Header = () => {
    const route = window.location.pathname;
    const dispatch = useDispatch();
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-5">
                        <Col><Link to="/">Hypertube </Link></Col>
                        <Col><Link to="/search">{lang.ru.search}</Link></Col>
                        <Col><Link to="/user">{lang.ru.user}</Link></Col>
                    </Nav>
                </Navbar.Collapse>
                <Button onClick={() => dispatch(userLogOut())}>Log out</Button>
                { route !== '/search' &&
                <InputGroup className="w-25 ml-0">
                    <FormControl
                        placeholder={lang.ru.search}
                        aria-label={lang.ru.search}
                        aria-describedby="basic-addon2"
                    />

                    <InputGroup.Append>
                        <Button variant="outline-secondary">Search</Button>
                    </InputGroup.Append>
                </InputGroup>
                }
            </Navbar>
        </>
    );
}

export default Header;