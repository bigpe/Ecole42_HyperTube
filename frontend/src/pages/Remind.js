import React from 'react';
import { useState } from 'react';
import { Button, Col, Container, Input, Row, Card, CardBody, Label, NavLink } from 'reactstrap';
import "../App.css";
import { getGetRequest } from "../utils/api";

const Remind = () => {
    const [email, setEmail] = useState('');
    //const [msg, setMsg] = useState(null);
    
    const remind = () => {
        getGetRequest(`/user/password/reset/?email=${email}`)
            .then((result) => {
                console.log(result);
                if (!result.data.error)
                    console.log(result);
            })
    }
    
    return (
        <section className="conteiner login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card className="mb-4 shadow-sm">
                            <CardBody>
                                <Col>
                                    <Label className="font-profile-head">
                                        Enter your email address to receive a secured link
                                    </Label>
                                    <Input onChange={e => setEmail(e.target.value)}/>
                                    <Button className="remind-button" color='secondary' onClick={remind} block>Remind</Button>
                                </Col>
                                <Col>
                                    <div className="dropdown-divider"></div>
                                    <NavLink href='/' >Back</NavLink>
                                </Col>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section >
    )
}

export default Remind;