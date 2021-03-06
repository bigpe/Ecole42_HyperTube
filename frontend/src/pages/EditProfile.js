import { useState, useEffect } from 'react';
import { Card, CardBody, Row, Col, Container, Input, Button, FormFeedback, Label, FormGroup, NavLink, CardTitle, CardImg, Alert } from 'reactstrap';
import { Form } from "react-bootstrap";
import { getRequest, getImageRequest} from "../utils/api";
import { isValidInput } from '../utils/checkValid';
import no_photo from "./no_photo.jpg"
import { UserSelector } from "../selectors/user";
import { LangSelector } from "../selectors/common";
import { lang } from '../utils/location';
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import { setUserData } from "../actions/user";
import { setLang } from "../actions/common";
import Info from "../components/Info/Info";
import "../App.css"

const mapStateToProps = (state) => ({
    user: UserSelector(state),
    langv: LangSelector(state)
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
                        }
                    })
            }
            else if (name === 'email') {
                getRequest('/user/email/', { email : value })
                    .then(result => {
                        if (result.data.message == 'Email exist') {
                            toggleValid('is-invalid');
                            setFeedback(`email is taken`);
                        }
                    })
            }
            else if (name === 'currentPass') {
                getRequest('/user/password/check/', { password: value })
                    .then(result => {
                        if (result.data.message == "Password Incorrect") {
                            toggleValid('is-invalid');
                            setFeedback(`Wrong password`);
                        }
                    })
            }
            props.set(value);
        }
        else {
            toggleValid('is-invalid');
            props.set(value);
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
                    className={`${isValid} ${props.class}`}
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
    const [isActiveBtnPass, toggleBtnPass] = useState(true);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);
    const dispatch = useDispatch();
    const { langv } = props;

    useEffect(() => {
        setLogin(props.user.login);
        setLastName(props.user.lastName);
        setFirstName(props.user.firstName);
        setEmail(props.user.email);
    },[]);

    const checkBtn = () => {
        const countInvalidInputs = document.querySelectorAll(".is-invalid.info").length;

        if (countInvalidInputs === 0)
            toggleBtn(false);
        else
            toggleBtn(true);
    }

    const checkBtnPass = () => {
        const countValidInputsPass = document.querySelectorAll(".is-valid.pass").length;

        if (countValidInputsPass === 2)
            toggleBtnPass(false);
        else
            toggleBtnPass(true);
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
            formData.append('userPhoto', file);
            getImageRequest('/user/', formData)
            .then((res) => {
                setMsg("Photo was successfuly changed!");
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

        getRequest('/user/', data)
            .then((res) => {
                if(!res.data.error)
                {
                    setMsg("Information was successfuly changed!");
                    dispatch(setUserData(data));
                }
                else
                    setErr("Error :(");
            });
    }

    const handleSubmitPassword = () => {
        if (currentPassword) {
            getRequest('/user/', { password : newPassword })
                .then((res) => {
                    if(!res.data.error) 
                        setMsg("Password was successfuly changed!!");
                    else 
                        setErr("Error :(");
                });
        }
    }

    const handleChangeLang = (e) => {
        dispatch(setLang(e.target.value));
        localStorage.setItem('lang', e.target.value);
    }
        return (
            <section className="conteiner login">
                <Container>
                    <Row>
                        <Col md={8} className="m-auto">
                            <Card className="mb-4 shadow-sm">
                                <CardBody>
                                            { msg && <Info isSuccess={'success'} message={msg} set={setMsg}/>}
                                            { err && <Info isSuccess={'danger'} message={err} set={setErr}/>}
                                    <Row>
                                        <Col> 
                                            <CardTitle tag="h5">{lang[langv].changeInfo}</CardTitle>
                                            <InputForm name='login' placeholder={lang[langv].login} feedback='Invalid login' value={login} defaultValue={props.user.login} set={setLogin} checkBtn={checkBtn} class={"info"}/>
                                            <InputForm name='firstName' placeholder={lang[langv].firstName} feedback='Only symbols are required' value={firstName} defaultValue={props.user.firstName} set={setFirstName} checkBtn={checkBtn} class={"info"}/>
                                            <InputForm name='lastName' placeholder={lang[langv].lastName} feedback='Only symbols are required' value={lastName} defaultValue={props.user.lastName} set={setLastName} checkBtn={checkBtn} class={"info"}/>
                                            <InputForm name='email' placeholder={lang[langv].email} set={setEmail} feedback='Invalid email' value={email} defaultValue={props.user.email} checkBtn={checkBtn} class={"info"}/>
                                            <Button className="btn-success" type="submit" value="Save" onClick={handleSubmitInfo} disabled={isActiveBtn} block>{lang[langv].save}</Button>
                                            
                                            <CardTitle className="mt-3" tag="h5">{lang[langv].changePas}</CardTitle>
                                            <InputForm name='currentPass' type='password' placeholder={lang[langv].curPassword} feedback='Too weak password. 8 symbols and special symbol are required' set={setCurrentPassword} checkBtn={checkBtnPass} class={"pass"}/>
                                            <InputForm name='newPass' type='password' placeholder={lang[langv].newPassword} feedback='Too weak password. 8 symbols and special symbol are required' set={setNewPassword} checkBtn={checkBtnPass} class={"pass"}/>
                                            <Button className="btn-success" type="submit" value="Save" onClick={handleSubmitPassword} disabled={isActiveBtnPass} block>{lang[langv].save}</Button>
                                        </Col>
                                        <Col>
                                            <CardTitle tag="h5">{lang[langv].changePic}</CardTitle>
                                            <CardImg width="30%" src={props.user.userPhoto || no_photo} className="profile-img"/>
                                            <Label className=" btn btn-block btn-success mt-3">{lang[langv].changePicBut}
                                                <Input style={{display : 'none'}} className="profile-input" type="file" onChange={e => putPhoto(e)} />
                                            </Label>
                                            <CardTitle tag="h5">{lang[langv].changeLang}</CardTitle>
                                            <Form.Control as="select" defaultValue={langv} custom onChange={handleChangeLang}>
                                                <option value="ru">Russian</option>
                                                <option value="eng">English</option>
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                    <div className="dropdown-divider"></div>
                                    <NavLink href='/profile'>{lang[langv].back}</NavLink>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section >
        );
}

export default connect(mapStateToProps)(EditProfile);