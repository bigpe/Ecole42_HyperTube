import React from "react";
import {Button, Dropdown, FormControl, InputGroup, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

const Header = () => {
    const route = window.location.pathname;
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Link to="/">Hypertube </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Link to="/search">Search </Link>
                        <Link to="/user">User </Link>
                    </Nav>
                </Navbar.Collapse>
                { route !== '/search' &&
                <InputGroup className="w-25 ml-0">
                    <FormControl
                        placeholder="Search movie"
                        aria-label="Search  movie"
                        aria-describedby="basic-addon2"
                    />

                    <InputGroup.Append>
                        <Button variant="outline-secondary">Search</Button>
                    </InputGroup.Append>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                        <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                        <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                        <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                    </Dropdown.Menu>
                </InputGroup>
                }
            </Navbar>
        </>
    );
}

export default Header;