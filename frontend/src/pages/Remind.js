import React from 'react';
import { Button, Col, Container, Input, Row, Card, CardBody, Label, NavLink } from 'reactstrap';
import "../App.css";

const Remind = () => {
    /*
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState(null);
    const [isSuccess, setSuccess] = useState(null);
    const remind = () => {
        const data = {
            email: email
        }
       //запрос
    }
    */
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
                                    <Input/>
                                    <Button className="remind-button" color='secondary' block>Remind</Button>
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