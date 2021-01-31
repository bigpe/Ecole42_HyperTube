import React from "react";
import {FormControl, InputGroup, } from "react-bootstrap";
import {lang} from "../../utils/location";

const Search = ({langv, changeValue}) => {
    return (
        <>
            <InputGroup.Append className="w-50">
                <FormControl
                    placeholder={lang[langv].search}
                    aria-label={lang[langv].search}
                    aria-describedby="basic-addon2"
                    onChange={(e) => changeValue(e.target.value)}
                />
            </InputGroup.Append>
        </>
    )
}
export default Search;