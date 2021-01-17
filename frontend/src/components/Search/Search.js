import React, {useState} from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getSearch } from "../../actions/movie";

const Search = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();

    return (
        <>
            <InputGroup.Append className="w-50">
                <FormControl
                placeholder="Search movie"
                aria-label="Search movie"
                aria-describedby="basic-addon2"
                onChange={(e) => setQuery(e.target.value)}
            />
                <Button variant="outline-secondary" onClick={() => dispatch(getSearch(query))}>Search</Button>
            </InputGroup.Append>
        </>
    )
}
export default Search;