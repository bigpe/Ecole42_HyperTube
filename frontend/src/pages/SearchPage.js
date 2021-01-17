import React from "react";
import Search from "../components/Search";
import { Row, Container } from "react-bootstrap";

const SearchPage = () => {

    return (
        <Container>
            <Row className="mt-5 justify-content-center">
                <Search/>
                <SearchList />
            </Row>
        </Container>
    )
}
export default SearchPage;