import React, { useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardImg, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import { connect } from "react-redux";
import { UserSelector } from "../selectors/user";
import no_photo from "./no_photo.jpg"
import "../App.css"
import { useDispatch } from "react-redux";
import { lang } from '../utils/location';
import { setUserData } from "../actions/user";
import { getGetRequest } from "../utils/api";
import {LangSelector} from "../selectors/common";
import {Link} from "react-router-dom";

const mapStateToProps = (state) => ({
    user: UserSelector(state),
    langv: LangSelector(state)
})


const Profile = (props) => {
    const dispatch = useDispatch();
    const { langv } = props;
    useEffect(() => {
        getGetRequest('/user/auth/')
            .then((res) => {
                const data = {
                    auth: true,
                    login: res.data.login,
                    firstName : res.data.firstName, 
                    lastName: res.data.lastName, 
                    email: res.data.email,
                    userPhoto: res.data.userPhoto,
                }
                console.log(res);
                if (!res.data.error) {
                    dispatch(setUserData(data));
                }
            });
    },[]);

    return(
        <Container className="conteiner">
            <Col md={8} className="m-auto">
                    <Card className="mb-4">
                        <Row>
                            <Col>
                                <CardBody>
                                    <Col md={5} className="m-auto">
                                        <CardImg width="200px" src={props.user.userPhoto || no_photo} className="profile-img"/>
                                    </Col>
                                    <CardTitle tag="h3">{props.user.login}</CardTitle>
                                    <CardSubtitle tag="h4" className="mb-2 text-muted">{props.user.firstName} {props.user.lastName}</CardSubtitle>
                                    <Link to="/edit_profile"><Button color="danger" className="card-btn btn btn-secondary">{lang[langv].editProfile}</Button></Link>
                                </CardBody>
                            </Col>
                        </Row>
                    </Card>
                </Col>
        </Container>
    );
}

export default connect(mapStateToProps)(Profile);