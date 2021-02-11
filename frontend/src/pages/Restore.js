import React, { useState, useEffect } from 'react';
import { Container, Alert, Input, Col, Label, Card, CardBody, Button, FormGroup, FormFeedback} from 'reactstrap';
import { getGetRequest } from "../utils/api";
import { useHistory } from "react-router-dom";
import "../App.css";
import { isValidInput } from '../utils/checkValid';


function InputForm(props) {
    const [isValid, toggleValid] = useState('');
    const [newFeedback, setFeedback] = useState(null);

    const inputChange = (e) => {
        const { name, value } = e.target;

        if (isValidInput(name, value)) {
            toggleValid('is-valid');
            if (name === 'rePass' && props.new !== value) {
                toggleValid('is-invalid');
                setFeedback('Password does not match');
            }
            if (name === 'newPass')
                props.set(value);
        }
        else {
            toggleValid('is-invalid');
        }
    };

    return (
        <Col>
            <FormGroup>
                {props.label}
                <Input
                    type='password'
                    name={props.name}
                    onChange={inputChange}
                    onBlur={props.checkBtn}
                    className={isValid}
                    required
                />
                <FormFeedback>{newFeedback || props.feedback}</FormFeedback>
            </FormGroup>
        </Col>
    )
}

const Restore = () => {
    const [newPass, setPass] = useState();
    const [isActive, toggleBtn] = useState(true);
    const history = useHistory();

    useEffect(() => {
        getGetRequest('/user/reset/')
            .then((res) => {
                if( res.data.error )
                {
                     history.push('/');
                }
            });
    },[]);

    const checkBtn = () => {
        const countInvalidInputs = document.querySelectorAll(".is-valid").length;

        if (countInvalidInputs === 2)
            toggleBtn(false);
        else
            toggleBtn(true);
    }

    const handleBtn = () => {
        getGetRequest('/user/password/reset/')
        .then((res) => {
            if( !res.data.error )
            {
                history.push('/');
            }
        });

    }

    return (
        <section className="conteiner login">
            <Container>
                <Col md={6} className="m-auto">
                    <Card className="mb-4 shadow-sm">
                        <CardBody>
                            <InputForm name='newPass' label='New password' feedback='Too weak pass' set={setPass} checkBtn={checkBtn}/>
                            <InputForm name='rePass' label='Repeat password' feedback='Too weak pass' new={newPass} checkBtn={checkBtn}/>
                            <Col>
                                <Button className="login-btn" color='secondary' disabled={isActive} onClick={handleBtn} block>Change</Button>
                            </Col>
                        </CardBody>
                    </Card>
                </Col>
            </Container>
        </section>
    )
}

export default Restore;