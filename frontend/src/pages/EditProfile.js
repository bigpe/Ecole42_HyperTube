import { useState } from 'react';
import { Card, CardBody, Row, Col, Container, Input, Button, FormFeedback, Label, FormGroup, NavLink, CardTitle, CardImg } from 'reactstrap';
import { getRequest, getImgRequest} from "../utils/api";
import { isValidInput } from '../utils/checkValid';
import "../App.css"
import no_photo from "./no_photo.jpg"

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
                        if (result.data.message !== "Password correct") {
                            toggleValid('is-invalid');
                            setFeedback(`Wrong password`);
                        }
                    })
            }
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
    const putPhoto = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const type = e.target.files[0].type;
            if (!type.match("image/png") && !type.match("image/jpeg") && !type.match("image/jpg")) {
                alert('Wrong format!');
                return;
            }
            let formData = new FormData();
            formData.append('photo', file);

            getImgRequest('/user/', { userPhoto : formData })
            .then((res) => {
                console.log(res);
                console.log(formData);
            });
        }
    }

    const handleSubmitInfo = () => {
        const data = {
            login: login,
            email: email,
            firstName: firstName,
            lastName: lastName,
        }
        getRequest('/user/', data)
        .then((res) => {
            console.log(res);
        });
    }

    const handleSubmitPassword = () => {
        if (currentPassword)
        {
            getRequest('/user/', { password : newPassword })
                .then((res) => {
                    console.log(res);
                });
        }
    }

        return (
            <section className="conteiner login">
                <Container>
                    <Row>
                        <Col md={8} className="m-auto">
                            <Card className="mb-4 shadow-sm">
                                <CardBody>
                                    <Row>
                                        <Col> 
                                            <CardTitle tag="h5">Change information</CardTitle>
                                            <InputForm name='login' placeholder='Login' feedback='Invalid login' set={setLogin} checkBtn={checkBtn} />
                                            <InputForm name='firstName' placeholder='First name' feedback='Only symbols are required' set={setFirstName} checkBtn={checkBtn}/>
                                            <InputForm name='lastName' placeholder='Last name' feedback='Only symbols are required' set={setLastName} checkBtn={checkBtn}/>
                                            <InputForm name='email' placeholder='Email' set={setEmail} feedback='Invalid email' checkBtn={checkBtn}/>
                                            <Button className="btn-success" type="submit" value="Save" onClick={handleSubmitInfo} disabled={isActiveBtn} block>Save</Button>
                                            
                                            <CardTitle className="mt-3" tag="h5">Change password</CardTitle>
                                            <InputForm name='currentPass' type='password' placeholder='Current password' feedback='Too weak password. 8 symbols is required' set={setCurrentPassword} checkBtn={checkBtn}/>
                                            <InputForm name='newPass' type='password' placeholder='New password' feedback='Too weak password. 8 symbols is required' set={setNewPassword} checkBtn={checkBtn}/>
                                            <Button className="btn-success" type="submit" value="Save" onClick={handleSubmitPassword} disabled={isActiveBtn} block>Save</Button>
                                        </Col>
                                        <Col>
                                            <CardTitle tag="h5">Change photo</CardTitle>
                                            <CardImg width="30%" src={no_photo} className="profile-img"/>
                                            <Label className=" btn btn-block btn-success mt-3">Upload new image
                                                <Input style={{display : 'none'}} className="profile-input" type="file" onChange={e => putPhoto(e)} />
                                            </Label>
                                        </Col>
                                    </Row>
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