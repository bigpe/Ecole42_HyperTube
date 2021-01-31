import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from "react-bootstrap/Dropdown";
import {lang} from "../../utils/location";

const DropdownInput = ({selectFunc, placeholder, value, items}) => (
            <Dropdown className="mt-1" onSelect={selectFunc}>
                <Dropdown.Toggle id="dropdown-basic">
                    {value || placeholder}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        items?.length && items.map((item, i) => (
                            <Dropdown.Item eventKey={item} key={i}>{item}</Dropdown.Item>
                        ))
                    }
                </Dropdown.Menu>
            </Dropdown>
);

DropdownInput.propTypes = {
    selectFunc: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    items: PropTypes.array,
};

export default DropdownInput;