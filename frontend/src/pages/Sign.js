import React from 'react';
import { useState } from 'react';
import { NavLink, Card, CardBody, Row, Col, FormGroup, Label, Input, FormFeedback, Button, Container, Alert } from 'reactstrap';
import { isValidInput, isValidPassword } from '../utils/Check_valid';
import {getRequest} from "../utils/api";

function InputForm(props) {
    const [isValid, toggleValid] = useState('');

    const nameChange = (e) => {
        const { name, value } = e.target;

        if (isValidInput(name, value)) {
            toggleValid('is-valid');
            //props.set(value);
        }
        else
            toggleValid('is-invalid');
    };

    return (
        <FormGroup>
            <Label>
                {props.labelName}
            </Label>
                <Input
                    type={props.type}
                    name={props.name}
                    onChange={nameChange}
                    onBlur={props.onBlur}
                    placeholder={props.placeholder}
                    className={isValid}
                    required
                />
                <FormFeedback>{props.feedback}</FormFeedback>
        </FormGroup>
    )
}

function InputFormWithFetch(props) {
    const [isValid, toggleValid] = useState('');
    //const [feedback, setFeedback] = useState('Oopsy');

    const checkExist = (name, value) => {
        getRequest(`/user/login?${name}=${value}`)
            .then(result => {
                    if (result.exist === true) {
                        toggleValid('is-invalid');
                        console.log(`${name} is taken`);
                        //setFeedback(`${name} is taken`)
                    }
                    else
                        console.log(`${name} is free`);
                }
            )
    }

    const inputChange = (e) => {
        const { name, value } = e.target;
        if (isValidInput(name, value) === true && value.length > 2) {
            toggleValid('is-valid');
            checkExist(name, value);
            //props.set(value);
        }
        else {
            toggleValid('is-invalid');
            //setFeedback(`${name} is invalid`)
        }
    };

    return (
        <FormGroup>
            <Label>
                {props.labelName}
            </Label>
                <Input
                    type="text"
                    name={props.labelName}
                    onChange={inputChange}
                    onBlur={() => props.onBlur()}
                    placeholder={props.placeholder}
                    required
                    //feedback={feedback}
                    className={isValid}
                />
        </FormGroup>
    )
}

function Password(props) {
    const [isValidPass, toggleValidPass] = useState('');
    const [isValidRepass, toggleValidRepass] = useState('');

    const passChange = (e) => {
        const { name, value } = e.target;

        if (name === 'password') {
            if (isValidPassword(value) === true) {
                toggleValidPass('is-valid');
                //props.setPass(value);
            }
            else
                toggleValidPass('is-invalid');
        }
        else {
            const password = document.querySelector('input[name="password"]').value;

            if (password === value) {
                toggleValidRepass('is-valid');
            }
            else
                toggleValidRepass('is-invalid');
        }
    };

    return (
        <div>
            <FormGroup>
                <Label className="font-profile-head">
                    Password
                </Label>
                <Input
                        id="1"
                        type="password"
                        name='password'
                        onChange={passChange}
                        onBlur={() => props.onBlur()}
                        className={isValidPass}
                        required
                />
                <FormFeedback>Too weak password. 8 symbols is required</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label className="font-profile-head">
                    Re-Password
                </Label>
                <Input
                        type="password"
                        name='repassword'
                        onChange={passChange}
                        onBlur={() => props.onBlur()}
                        className={isValidRepass}
                        required
                />
                <FormFeedback>Password doesn't match</FormFeedback>
            </FormGroup>
        </div>
    )
}

const Sign = (props) => {
    const [isActiveBtn, toggleBtn] = useState(true);

    const handleSubmit = () => {
        const { userName, lastName, firstName, email, password } = props.sign;
        let data = {
            userName: userName,
            lastName: lastName,
            firstName: firstName,
            email: email,
            password: password
        }
        console.log(data);
    }

    const checkBtn = () => {
        const countValidInputs = document.querySelectorAll(".is-valid").length;
        const countInvalidInputs = document.querySelectorAll(".is-invalid").length;
        if (countValidInputs === 6 && countInvalidInputs === 0)
            toggleBtn(false);
        else
            toggleBtn(true);
    }

    if (props.errMsg) {
        return (
            <Alert color='info'>{props.errMsg}</Alert>
        )
    }
    else
        return (
            <section className="conteiner login">
                <Container>
                    <Row>
                        <Col md={6} className="m-auto">
                            <Card className="mb-4 shadow-sm">
                                <CardBody>
                                    <InputForm
                                        onBlur={checkBtn} labelName='Last name'
                                        name='lastName' type='text' feedback='Only symbols are required'
                                    />
                                    <InputForm
                                        onBlur={checkBtn} labelName='First name'
                                        name='firstName' type='text' feedback='Only symbols are required'
                                    />
                                    <InputFormWithFetch onBlur={checkBtn} labelName='Login'/>
                                    <InputFormWithFetch onBlur={checkBtn} labelName='Email'/>
                                    <Password onBlur={checkBtn} />
                                    <Button color="secondary" type="submit" disabled={isActiveBtn} onClick={handleSubmit} onBlur={checkBtn} block>Sign Up</Button>
                                    <Col>
                                        <div className="dropdown-divider"></div>
                                        <NavLink href='/auth'>Back</NavLink>
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        )
}
export default Sign;