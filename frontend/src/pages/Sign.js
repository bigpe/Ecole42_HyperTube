import React from 'react';
import { useState } from 'react';
import { NavLink, Card, CardBody, Row, Col, FormGroup, Label, Input, FormFeedback, Button, Container, Alert } from 'reactstrap';
import { isValidInput, isValidPassword } from '../utils/checkValid';
import {getRequest, putRequest} from "../utils/api";
import { useHistory } from "react-router-dom";

function InputForm(props) {
    const [isValid, toggleValid] = useState('');

    const nameChange = (e) => {
        const { name, value } = e.target;

        if (isValidInput(name, value)) {
            toggleValid('is-valid');
            props.set(value);
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
    const [feedback, setFeedback] = useState('Oopsy');

    const checkExist = (name, value) => {

        if (name == 'login') {
            getRequest(`/user/login`, { login : value })
                .then(result => {
                    if (result.data.message == 'Login exist') {
                        toggleValid('is-invalid');
                        setFeedback(`login is taken`);
                        console.log(result);
                    }
                })
        }
        else if (name == 'email') {
            getRequest(`/user/email`, { email : value })
            .then(result => {
                if (result.data.message == 'Email exist') {
                    toggleValid('is-invalid');
                    setFeedback(`email is taken`);
                    console.log(result);
                }
            })
        }
    }

    const inputChange = (e) => {
        const { name, value } = e.target;
        if (isValidInput(name, value) === true && value.length > 2) {
            toggleValid('is-valid');
            checkExist(name, value);
            props.set(value);
        }
        else {
            toggleValid('is-invalid');
            setFeedback(`${name} is invalid`)
        }
    };

    return (
        <FormGroup>
            <Label>
                {props.labelName}
            </Label>
                <Input
                    type="text"
                    name={props.name}
                    onChange={inputChange}
                    onBlur={() => props.onBlur()}
                    placeholder={props.placeholder}
                    required
                    feedback={feedback}
                    className={isValid}
                />
                <FormFeedback>{feedback}</FormFeedback>
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
                props.setPass(value);
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
    const history = useHistory();
    const [login, setLogin] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActiveBtn, toggleBtn] = useState(true);

    const handleSubmit = () => {
        putRequest('/user/', {
            login : login, 
            password: password, 
            firstName : firstName, 
            lastName : lastName, 
            email : email
        })
        .then(res => {
            console.log(res);
            history.push('/');
            //setMsg("Account has created successfully");
        })

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
                                        set={setLastName} onBlur={checkBtn} labelName='Last name'
                                        name='lastName' type='text' feedback='Only symbols are required'
                                    />
                                    <InputForm
                                        set={setFirstName} onBlur={checkBtn} labelName='First name'
                                        name='firstName' type='text' feedback='Only symbols are required'
                                    />
                                    <InputFormWithFetch set={setLogin} onBlur={checkBtn} labelName='Login' name='login'/>
                                    <InputFormWithFetch set={setEmail} onBlur={checkBtn} labelName='Email' name='email'/>
                                    <Password setPass={setPassword} onBlur={checkBtn} />
                                    <Button color="secondary" type="submit" disabled={isActiveBtn} onClick={handleSubmit} onBlur={checkBtn} block>Sign Up</Button>
                                    <Col>
                                        <div className="dropdown-divider"></div>
                                        <NavLink href='/'>Back</NavLink>
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