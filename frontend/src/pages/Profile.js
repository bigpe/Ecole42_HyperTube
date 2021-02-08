import React, { useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardImg, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import { connect } from "react-redux";
import { UserSelector } from "../selectors/user";
import no_photo from "./no_photo.jpg"
import "../App.css"
import { useDispatch } from "react-redux";
import { setUserData } from "../actions/user";
import { getGetRequest } from "../utils/api";

const mapStateToProps = (state) => ({
    user: UserSelector(state)
})


const Profile = (props) => {
    const dispatch = useDispatch();

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
                    <Card className="mb-4">
                        <Row>
                            <Col>
                                <CardBody>
                                    <CardImg width="60%" src={props.user.userPhoto || no_photo} className="profile-img"/>
                                    <CardTitle tag="h3">{props.user.login}</CardTitle>
                                    <CardSubtitle tag="h4" className="mb-2 text-muted">{props.user.firstName} {props.user.lastName}</CardSubtitle>
                                    <Button color="danger" href="/edit_profile" className="card-btn btn btn-secondary">Edit profile</Button>
                                </CardBody>
                            </Col>
                        </Row>
                    </Card>
        </Container>
    );
}

export default connect(mapStateToProps)(Profile);