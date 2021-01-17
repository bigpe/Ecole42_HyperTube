import React from "react";
import Search from "../components/Search";
import { Row, Container } from "react-bootstrap";
import SearchList from "../components/SearchList";

const SearchPage = () => {

    return (
        <Container>
            <Row className="mt-5 justify-content-center">
                <Search/>
            </Row>
            <Row className="mt-5 justify-content-center">
                <SearchList />
            </Row>
        </Container>
    )
}

export default SearchPage;