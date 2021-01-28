import React, {useState} from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getSearch } from "../../actions/movie";
import Dropdown from "react-bootstrap/Dropdown";

const Search = () => {
    const [query, setQuery] = useState('');
    const fetch = useDispatch()(getSearch(query));
    //todo сделать контроллеры для
    // - sort_by (select)
    // - от меньшего к большему (select)
    // - строка по жанрам
    // - минимальный рейтинг
    return (
        <>
            <Dropdown>
                <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
            </Dropdown>
            <InputGroup.Append className="w-50">
                <FormControl
                placeholder="Search movie"
                aria-label="Search movie"
                aria-describedby="basic-addon2"
                onChange={(e) => setQuery(e.target.value)}
            />
                <Button variant="outline-secondary" onClick={() => fetch}>Search</Button>
            </InputGroup.Append>
        </>
    )
}
export default Search;