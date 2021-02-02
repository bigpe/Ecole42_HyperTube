import { useState } from 'react';
import { Card, CardBody, Row, Col, Container, Input, Button, FormFeedback, Label, FormGroup, NavLink } from 'reactstrap';
import {getRequest} from "../utils/api";
import { isValidInput } from '../utils/checkValid';
import "../App.css"


function InputForm(props) {
    const [isValid, toggleValid] = useState('');
    const [feedback, setFeedback] = useState(props.feedback);

    const inputChange = (e) => {
        const { name, value } = e.target;

        if (isValidInput(name, value)) {
            toggleValid('is-valid');
            if (name === 'login') {
                getRequest(`/user/login`, { login : value })
                    .then(result => {
                        if (result.data.message == 'Login exist') {
                            toggleValid('is-invalid');
                            setFeedback(`login is taken`);
                            console.log(result);
                        }
                    })
            }
            else if (name === 'email') {
                getRequest('/user/email', { email : value })
                    .then(result => {
                        if (result.data.message == 'Email exist') {
                            toggleValid('is-invalid');
                            setFeedback(`email is taken`);
                            console.log(result);
                        }
                    })
            }
            else if (name === 'currentPass') {
                getRequest('/user/password/check', { password: value })
                    .then(result => {
                        console.log('h2', result);
                        if (result.success !== true) {
                            toggleValid('is-invalid');
                            setFeedback(`Wrong password`);
                        }
                    })
            }
            if (name !== 'currentPass')
                props.set(value)
        }
        else {
            toggleValid('is-invalid');
        }
    };

    return (
        <div>
            <FormGroup>
                <Label>
                    {props.label}
                </Label>
                <Input
                    type={props.type || 'text'}
                    placeholder={props.placeholder || ''}
                    name={props.name}
                    defaultValue={props.me || ''}
                    onChange={inputChange}
                    onBlur={props.checkBtn}
                    className={isValid}
                />
                <FormFeedback>{feedback}</FormFeedback>
            </FormGroup>
        </div>
    )
}

const EditProfile = () => {
    const [login, setLogin] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isActiveBtn, toggleBtn] = useState(true);

    const checkBtn = () => {
        const countInvalidInputs = document.querySelectorAll(".is-invalid").length;

        if (countInvalidInputs === 0)
            toggleBtn(false);
        else
            toggleBtn(true);
    }

    const handleSubmit = () => {
        const data = {
            login: login,
            firstName: firstName,
            lastName: lastName,
            email: email,
            newPassword: newPassword
        }
        //getRequest('/user/', data);
    }

        return (
            <section className="conteiner login">
                <Container>
                    <Row>
                        <Col md={6} className="m-auto">
                            <Card className="mb-4 shadow-sm">
                                <CardBody>
                                    <InputForm name='login' label='Login' feedback='Invalid login' set={setLogin} checkBtn={checkBtn}/>
                                    <InputForm name='firstName' label='First name' feedback='Only symbols are required' set={setFirstName} checkBtn={checkBtn}/>
                                    <InputForm name='lastName' label='Last name' feedback='Only symbols are required' set={setLastName} checkBtn={checkBtn}/>
                                    <InputForm name='email' label='Email' set={setEmail} feedback='Invalid email' checkBtn={checkBtn}/>
                                    <InputForm name='currentPass' type='password' label='Current password' feedback='Too weak password. 8 symbols is required' set={setCurrentPassword} checkBtn={checkBtn}/>
                                    <InputForm name='newPass' type='password' label='New password' feedback='Too weak password. 8 symbols is required' set={setNewPassword} checkBtn={checkBtn}/>
                                    <Button className="btn-success" type="submit" value="Save" onClick={handleSubmit} disabled={isActiveBtn} block>Save</Button>
                                    <div className="dropdown-divider"></div>
                                    <NavLink href='/profile'>Back</NavLink>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section >
        );
}

export default EditProfile;
