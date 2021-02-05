import React from "react";
import { Container, Row, Col, Card, CardBody, CardImg, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import { connect } from "react-redux";
import { UserSelector } from "../selectors/user";
import no_photo from "./no_photo.jpg"
import "../App.css"

const mapStateToProps = (state) => ({
    user: UserSelector(state)
})


const Profile = (props) => {

    return(
        <Container className="conteiner">
                    <Card className="mb-4">
                        <Row>
                            <Col>
                                <CardBody>
                                    <CardImg width="60%" src={props.user.photo || no_photo} className="profile-img"/>
                                </CardBody>
                            </Col>
                            <Col >
                                <CardBody>
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