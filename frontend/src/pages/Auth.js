import React from 'react';
import { useState } from 'react';
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input, NavLink, CardTitle} from 'reactstrap';
import { useDispatch } from "react-redux";
import { userLogIn } from "../actions/user";
import logo_42 from "./42_logo.svg";
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';
import { getRequest, getGetRequest } from "../utils/api";



function LoginGoogle() {
    const clientId = '241696023762-9cvk3687223kn9kqklfb5bjv20jsc920.apps.googleusercontent.com';
    const dispatch = useDispatch();
    
    const responseGoogle = (response) => {
        getGetRequest(`/user/auth/google/?id_token=${response.tokenId}`)
        .then((result) => {
            if (!result.data.error)
            dispatch(userLogIn());
            refreshTokenSetup(response);
        })
        
    }
    const onFailure = (res) => {
        console.log('Login failed: res:', res);
    };
    
    return (
        <GoogleLogin
        clientId={clientId}
        buttonText=""
        onSuccess={responseGoogle}
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

    const handleSubmit = () => {
        getRequest('/user/auth/', {
            login : login, 
            password: password
        })
        .then(result => {
            if (!result.data.error){
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
                                            <LoginGoogle/>
                                            <form target="_blank" action="https://api.intra.42.fr/oauth/authorize" method="GET">
                                                <input type="hidden" name="client_id" value="db5cd84b784b4c4998f4131c353ef1828345aa1ce5ed3b6ebac9f7e4080be068"></input>
                                                <input type="hidden" name="redirect_uri" value="http://localhost:5006/user/auth/42/"></input>
                                                <input type="hidden" name="response_type" value="code"></input>
                                                <Button className="login-btn" color="secondary"><img width={25} src={logo_42}></img></Button>
                                            </form>
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
