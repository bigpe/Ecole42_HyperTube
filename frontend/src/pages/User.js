import React from "react";
import {Container, Row, Col, Card, CardBody, CardImg, CardTitle, CardSubtitle, CardText, Button} from 'reactstrap';
import "../App.css"
import no_photo from "./no_photo.jpg"

const User = () => {
    let user = {
        nickname : "ffood",
        firstname : "Sofia",
        lastname : "Sherbakova",
        avatar : ""
    };
   return(
        <Container className="conteiner">
                    <Card className="mb-4">
                        <Row>
                            <Col>
                                <CardBody>
                                    <CardImg width="60%" src={no_photo} className="profile-img"/>
                                </CardBody>
                            </Col>
                            <Col >
                                <CardBody>
                                    <CardTitle tag="h3">{user.nickname}</CardTitle>
                                    <CardSubtitle tag="h4" className="mb-2 text-muted">{user.firstname} {user.lastname}</CardSubtitle>
                                    <Button color="danger" href="/edit_profile" className="card-btn btn btn-secondary">Edit profile</Button>
                                </CardBody>
                            </Col>
                        </Row>
                    </Card>
        </Container>

   );
}

export default User;