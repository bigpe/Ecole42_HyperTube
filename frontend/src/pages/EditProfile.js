import { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col, Container, Input, Button, FormFeedback, Label, FormGroup, NavLink, CardTitle, CardImg } from 'reactstrap';
import { getRequest, getImageRequest} from "../utils/api";
import { isValidInput } from '../utils/checkValid';
import "../App.css"
import no_photo from "./no_photo.jpg"
import { UserSelector } from "../selectors/user";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { setUserData } from "../actions/user";

const mapStateToProps = (state) => ({
    user: UserSelector(state)
})


function InputForm(props) {
    const [isValid, toggleValid] = useState('');
    const [feedback, setFeedback] = useState(props.feedback);

    const inputChange = (e) => {
        const { name, value } = e.target;

        props.checkBtn();
        if (isValidInput(name, value)) {
            toggleValid('is-valid');
            if (name === 'login') {
                getRequest(`/user/login/`, { login : value })
                    .then(result => {
                        if (result.data.message == 'Login exist') {
                            toggleValid('is-invalid');
                            setFeedback(`login is taken`);
                            console.log(result);
                        }
                    })
            }
            else if (name === 'email') {
                getRequest('/user/email/', { email : value })
                    .then(result => {
                        if (result.data.message == 'Email exist') {
                            toggleValid('is-invalid');
                            setFeedback(`email is taken`);
                            console.log(result);
                        }
                    })
            }
            else if (name === 'currentPass') {
                getRequest('/user/password/check/', { password: value })
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
                    value={props.value}
                    type={props.type || 'text'}
                    placeholder={props.placeholder || ''}
                    name={props.name}
                    onChange={inputChange}
                    onBlur={props.checkBtn}
                    className={isValid}
                    required
                />
                <FormFeedback>{feedback}</FormFeedback>
            </FormGroup>
        </div>
    )
}

const EditProfile = (props) => {
    const [login, setLogin] = useState(props.user.login);
    const [lastName, setLastName] = useState(props.user.lastName);
    const [firstName, setFirstName] = useState(props.user.firstName);
    const [email, setEmail] = useState(props.user.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isActiveBtn, toggleBtn] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        setLogin(props.user.login);
        setLastName(props.user.lastName);
        setFirstName(props.user.firstName);
        setEmail(props.user.email);
    },[props.user]);

    const checkBtn = () => {
        const countInvalidInputs = document.querySelectorAll(".is-invalid").length;

        if (countInvalidInputs === 0)
            toggleBtn(false);
        else
            toggleBtn(true);
    }

    const putPhoto = (e) => {
        console.log(e);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const type = e.target.files[0].type;
            console.log(file);
            console.log(type);
            if (!type.match("image/png") && !type.match("image/jpeg") && !type.match("image/jpg")) {
                alert('Wrong format!');
                return;
            }
            let formData = new FormData();
            formData.append('userPhoto', file);
            getImageRequest('/user/', formData)
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
            lastName: lastName
        }
        console.log(data);
        
        getRequest('/user/', data)
            .then((res) => {
                if(!res.data.error)
                {
                    console.log(res);
                    dispatch(setUserData(data));
                }
            });
    }

    const handleSubmitPassword = () => {
        if (currentPassword) {
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
                                            <InputForm name='login' placeholder='Login' feedback='Invalid login' value={login} defaultValue={props.user.login} set={setLogin} checkBtn={checkBtn} />
                                            <InputForm name='firstName' placeholder='First name' feedback='Only symbols are required' value={firstName} defaultValue={props.user.firstName} set={setFirstName} checkBtn={checkBtn}/>
                                            <InputForm name='lastName' placeholder='Last name' feedback='Only symbols are required' value={lastName} defaultValue={props.user.lastName} set={setLastName} checkBtn={checkBtn}/>
                                            <InputForm name='email' placeholder='Email' set={setEmail} feedback='Invalid email' value={email} defaultValue={props.user.email} checkBtn={checkBtn}/>
                                            <Button className="btn-success" type="submit" value="Save" onClick={handleSubmitInfo} disabled={isActiveBtn} block>Save</Button>
                                            
                                            <CardTitle className="mt-3" tag="h5">Change password</CardTitle>
                                            <InputForm name='currentPass' type='password' placeholder='Current password' feedback='Too weak password. 8 symbols is required' set={setCurrentPassword} checkBtn={checkBtn}/>
                                            <InputForm name='newPass' type='password' placeholder='New password' feedback='Too weak password. 8 symbols is required' set={setNewPassword} checkBtn={checkBtn}/>
                                            <Button className="btn-success" type="submit" value="Save" onClick={handleSubmitPassword} disabled={isActiveBtn} block>Save</Button>
                                        </Col>
                                        <Col>
                                            <CardTitle tag="h5">Change photo</CardTitle>
                                            <CardImg width="30%" src={props.user.userPhoto || no_photo} className="profile-img"/>
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

export default connect(mapStateToProps)(EditProfile);