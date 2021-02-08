import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Input, NavLink, Alert } from 'reactstrap';
import { useDispatch } from "react-redux";
import { userLogIn, setUserData } from "../actions/user";
import { addMsg } from "../actions/common";
import logo_42 from "./42_logo.svg";
import logo_google from "./Google_logo.svg";
import { GoogleLogin } from 'react-google-login';
import { getRequest, getGetRequest } from "../utils/api";
import { MsgSelector } from "../selectors/common";
import { connect } from "react-redux";


const Info = (props) => {
    const [isVisible, setClose] = useState(true);
    const color = props.isSuccess ? 'success' : 'danger';

    useEffect(() => {
        if (isVisible) {
            window.setTimeout(() => {
                setClose(!isVisible);
            }, 5000);
        }
    }, [isVisible]);

    return (
        <div>
            <Alert isOpen={isVisible} color={color}>{props.message}</Alert>
        </div>
    )
}


const mapStateToProps = (state) => ({
    msg: MsgSelector(state)
});

function LoginGoogle() {
    const clientId = '241696023762-9cvk3687223kn9kqklfb5bjv20jsc920.apps.googleusercontent.com';
    const dispatch = useDispatch();
    
    const responseGoogle = (response) => {
        getGetRequest(`/user/auth/google/?id_token=${response.tokenId}`)
        .then((result) => {
            console.log(result);
            if (!result.data.error)
            dispatch(setUserData());
            refreshTokenSetup(response);
                dispatch(userLogIn());
        })
        
    }
    const onFailure = (res) => {
        console.log('Login failed: res:', res);
    };
    
    return (
        <GoogleLogin
            clientId={clientId}
            buttonText=""
            render={renderProps => (
                <Button outline color="secondary" onClick={renderProps.onClick} disabled={renderProps.disabled}><img width={22} src={logo_google}></img></Button>
              )}
            onSuccess={responseGoogle}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn = { true }
            //style={{ marginTop: '100px', marginRight: '-10px'}}
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

const AuthPage = (props) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState(null);
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
            setMsg("Incorrect login or password :(");
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
                                    <Row className="text-center">
                                        <Col xs="auto" sm={{ offset: 4 }}>
                                            <form style={{ 'marginBottom': 0 }} target="_blank" action="https://api.intra.42.fr/oauth/authorize" method="GET">
                                                <input type="hidden" name="client_id" value="db5cd84b784b4c4998f4131c353ef1828345aa1ce5ed3b6ebac9f7e4080be068"></input>
                                                <input type="hidden" name="redirect_uri" value="http://localhost:5006/user/auth/42/"></input>
                                                <input type="hidden" name="response_type" value="code"></input>
                                                <Button className="login-btn" color="secondary"><img width={30} src={logo_42}></img></Button>
                                            </form>
                                        </Col>
                                        <Col xs="auto">
                                            <LoginGoogle/>
                                        </Col>
                                    </Row>                            
                                    { msg && <Info message={msg} />}
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

export default connect(mapStateToProps)(AuthPage);