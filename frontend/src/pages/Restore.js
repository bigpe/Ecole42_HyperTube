import React, { useState, useEffect } from 'react';
import { Container, Alert, Input, Col, Label, Card, CardBody, Button, FormGroup} from 'reactstrap';
import "../App.css";

function InputForm(props) {
    return (
        <Col>
            <FormGroup>
                {props.label}
                <Input
                        type="password"
                        name='password'
                        required
                    />
            </FormGroup>
        </Col>
    )
}

const Restore = () => {
   
    const handleBtn = () => {
        const data = {
        }
        //запрос
    }

    return (
        <section className="conteiner login">
            <Container>
                <Col md={6} className="m-auto">
                    <Card className="mb-4 shadow-sm">
                        <CardBody>
                            <InputForm name='newPass' label='New password' feedback='Too weak pass' />
                            <InputForm name='rePass' label='Repeat password' feedback='Too weak pass' />
                            <Col>
                                <Button className="login-btn" color='secondary' onClick={handleBtn} block>Change</Button>
                            </Col>
                        </CardBody>
                    </Card>
                </Col>
            </Container>
        </section>
    )
}

export default Restore;