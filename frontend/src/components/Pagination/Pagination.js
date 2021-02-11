import React from "react";
import {Pagination} from "react-bootstrap";
import {getSearch} from "../../actions/movie";
import {useDispatch} from "react-redux";

const PaginationComp = ({active, options, setPage, count}) => {
    let items = [];
    const dispatch = useDispatch();
    const fetchSearch = (num) => {
        dispatch(getSearch({...options, page: num }));
        setPage(num);
    };
    for (let i = 1; i <= count; i++) {
        items.push(<Pagination.Item key={i} active={i === active} onClick={() => fetchSearch(i)}>
            {i}
        </Pagination.Item>,)
    }

    return (
        <div>
            <Pagination size="sm">
                {items}
            </Pagination>
        </div>
    );
}

export default PaginationComp;