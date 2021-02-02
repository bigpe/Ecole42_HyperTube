import React from 'react';
import { useState } from 'react';
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input, NavLink, CardTitle} from 'reactstrap';
import { useDispatch } from "react-redux";
import { userLogIn } from "../actions/user";
import logo_42 from "./42_logo.svg";
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';
import { getIntraRequest } from "../utils/api";
import {getRequest } from "../utils/api";
import Cookies from "js-cookie";

const clientId = '241696023762-9cvk3687223kn9kqklfb5bjv20jsc920.apps.googleusercontent.com';

function LoginGoogle() {
    const onSuccess = (res) => {
        console.log('Login Success: currentUser:', res.profileObj);
        //alert(`Logged in successfully welcome ${res.profileObj.name} 😍.`);
        refreshTokenSetup(res);
    };
    const onFailure = (res) => {
        console.log('Login failed: res:', res);
    };

    return (
            <GoogleLogin
              clientId={clientId}
              buttonText=""
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              //style={{ marginTop: '100px', marginRight: '-10px'}}
              isSignedIn={true}
            />
    );
}

function LoginInput(props) {

    return (
        <Col>
            <FormGroup>
                    <Input
                        type="text"
                        name="Login"
                        placeholder="Your login"
                        onChange={e => props.set(e.target.value)}
                        required
                    />
            </FormGroup>
        </Col>
    )
}

function Password(props) {
    return (
        <Col>
            <FormGroup>
                <Input
                        type="password"
                        name='password'
                        onChange={e => props.set(e.target.value)}
                        placeholder="Your password"
                        required
                    />
            </FormGroup>
        </Col>
    )
}

const AuthPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    Cookies.set('access_token', '');

    const IntraOauth = () => {
        getIntraRequest(`https://api.intra.42.fr/oauth/authorize?client_id=db5cd84b784b4c4998f4131c353ef1828345aa1ce5ed3b6ebac9f7e4080be068&redirect_uri=http%3A%2F%2F0.0.0.0%3A8888&response_type=code`)
    
    }

    const handleSubmit = () => {
        getRequest('/user/auth', {
            login : login, 
            password: password
        })
        .then(result => {
            if(result.data.message == 'Authed' && !result.data.error){
                console.log(result);
                dispatch(userLogIn());
            }
        })

    }
    return (
        <section className="conteiner login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card className="mb-4 shadow-sm">
                            <CardBody>
                                <div className="sign">
                                    <Row>
                                        <Col>
                                            <Button className="login-btn" color="secondary" onClick={IntraOauth}><img width={25} src={logo_42}></img></Button>
                                            
                                        </Col>
                                    </Row>                            
                                </div>
                                <form >
                                    <LoginInput set={setLogin}/>
                                    <Password set={setPassword}/>
                                    <Col>
                                        <Button onClick={handleSubmit} className="login-btn" color="secondary" block>Sign in</Button>
                                    </Col>
                                </form>
                                <Col>
                                    <div className="dropdown-divider"></div>
                                    <NavLink href='/sign'>Newbee? Sign up!</NavLink>
                                    <NavLink href='/remind'>Forgot password? Remind</NavLink>
                                </Col>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default AuthPage;
//<LoginGoogle/>
//<Button onClick={() => dispatch(userLogIn())}>Log in </Button>

//