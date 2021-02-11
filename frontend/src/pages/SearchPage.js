import React, {useEffect, useState} from "react";
import Search from "../components/Search";
import {Row, Container, Form, Col, Button} from "react-bootstrap";
import SearchList from "../components/SearchList";
import {GenreSelector} from "../selectors/movie";
import {connect, useDispatch} from "react-redux";
import {getGenre, getSearch} from "../actions/movie";
import { lang } from '../utils/location';
import {LangSelector} from "../selectors/common";
import DropdownInput from "../components/DropdownInput";
import PaginationComp from "../components/Pagination/Pagination";

const SearchPage = ({genre, langv}) => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [genres, setGenres] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [rating, setRating] = useState('');
    const [page, setPage] = useState(1);

    const options = langv === 'eng' ? { sort_by: sortBy, order_by: orderBy, query, genre: genres, rating, page } :
        {
            sort_by: sortBy && lang[langv].sortByRuEng[sortBy],
            order_by: orderBy && lang[langv].orderByRuEng[orderBy],
            query,
            genre: genres && lang[langv].genreRuEng[genres],
            rating,
            page
        };

    const genreToggle = (val) => setGenres(val);
    const sortByToggle = (val) => setSortBy(val);
    const orderByToggle = (val) => setOrderBy(val);
    const ratingToggle = (val) => setRating(val.target.value);
    const fetchSearch = () => dispatch(getSearch(options));

    const genreArr = genre.length && genre.map(gen => gen.name);

    useEffect(() => {
        if(!genre.length) dispatch(getGenre('ru-RU'));
    }, [])

    return (
        <Container fluid>
            <Row className="mt-5 w-100 justify-content-center align-items-center">
                <Col>
                    <DropdownInput value={genres} placeholder={lang[langv].selectGenre} selectFunc={genreToggle} items={genreArr} />
                </Col>
                <Col>
                        <Row><Form.Label>{lang[langv].rating}</Form.Label></Row>
                        <Row className="w-100 justify-content-between">
                            <Form.Label>0</Form.Label>
                            <Form.Label>10</Form.Label>
                        </Row>
                        <Row><Form.Control type="range" custom onChange={ratingToggle} /></Row>
                </Col>
                <Col>
                    <DropdownInput value={sortBy} placeholder={lang[langv].sortByTitle} selectFunc={sortByToggle} items={lang[langv].sortBy} />
                    <DropdownInput value={orderBy} placeholder={lang[langv].orderByTitle} selectFunc={orderByToggle} items={lang[langv].orderBy}/>
                </Col>
            </Row>
            <Row className="mt-5 justify-content-center">
                <Search langv={langv} changeValue={setQuery}/>
                <Button variant="outline-secondary" onClick={fetchSearch}>{lang[langv].search}</Button>
            </Row>
            <Row className="mt-5 justify-content-center">
                <SearchList page={page} />
            </Row>
            <Row className="mt-5 justify-content-center">
                <PaginationComp active={page} setPage={setPage} options={options} count={3}/>
            </Row>
        </Container>
    )
}
const mapStateToProps = (state) => ({
    genre: GenreSelector(state),
    langv: LangSelector(state),
});
export default connect(mapStateToProps)(SearchPage);