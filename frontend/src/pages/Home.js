import React, {useEffect, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {GenreSelector, MovieSelector} from "../selectors/movie";
import {getGenre} from "../actions/movie";
import {Container, Modal} from "react-bootstrap";
import Genre from "../components/Genre/Genre";

const Home = ({movie, genre}) => {
    const dispatch = useDispatch();
    const [lgShow, setLgShow] = useState(false);

    useEffect(() => {
        if(!genre.length) dispatch(getGenre());
    }, [])

    return (
        <Container fluid className="justify-content-center">
            {
                !!genre.length && genre.map((item, i) => (
                    <Genre key={i} title={item.name} genreKey={i+1}/>
                ))
            }
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>...</Modal.Body>
            </Modal>

        </Container>
    )
}

const mapStateToProps = (state) => ({
    movie: MovieSelector(state),
    genre: GenreSelector(state),
});

export default connect(mapStateToProps)(Home);