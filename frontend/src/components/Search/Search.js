import React from "react";
import {Button, FormControl, InputGroup} from "react-bootstrap";

const Search = () => (
    <>
        <FormControl
            placeholder="Search movie"
            aria-label="Search  movie"
            aria-describedby="basic-addon2"
            className="w-50"
        />
        <InputGroup.Append>
            <Button variant="outline-secondary" >Search</Button>
        </InputGroup.Append>
    </>
)

export default Search;