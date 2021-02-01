import React from "react";
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input, NavLink, CardTitle} from 'reactstrap';
import {useDispatch} from "react-redux";
import {userLogIn} from "../actions/user";
//import "../App.css";
import logo_42 from "./42_logo.svg";
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';
import {getGetRequest} from "../utils/api";

const clientId = '241696023762-9cvk3687223kn9kqklfb5bjv20jsc920.apps.googleusercontent.com';

function LoginGoogle() {
  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    );
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };

  return (
          <GoogleLogin
            clientId={clientId}
            //buttonText=""
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={'single_host_origin'}
            //style={{ marginTop: '100px', marginRight: '-10px'}}
            isSignedIn={true}
          />
  );
}

function LoginInput() {
    return (
        <Col>
            <FormGroup>
                    <Input
                        type="text"
                        name="Login"
                        placeholder="Your email"
                        required
                    />
            </FormGroup>
        </Col>
    )
}

function Password() {
    return (
        <Col>
            <FormGroup>
                <Input
                        type="password"
                        name='password'
                        placeholder="Your password"
                        required
                    />
            </FormGroup>
        </Col>
    )
}

const AuthPage = () => {
    const dispatch = useDispatch();

    const IntraOauth = () => {
        getGetRequest(`https://api.intra.42.fr/oauth/authorize?client_id=db5cd84b784b4c4998f4131c353ef1828345aa1ce5ed3b6ebac9f7e4080be068&redirect_uri=http%3A%2F%2F0.0.0.0%3A8888&response_type=code`)
    
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
                                            <Button className="login-btn" color="secondary" onClick={IntraOauth}><img width={25} src={logo_42}></img><span>      Sign in with Intra</span></Button>
                                            <LoginGoogle/>
                                        </Col>
                                    </Row>                            
                                </div>
                                <form >
                                    <LoginInput/>
                                    <Password/>
                                    <Col>
                                        <Button onClick={() => dispatch(userLogIn())} className="login-btn" color="secondary" block>Sign in</Button>
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
//<Button onClick={() => dispatch(userLogIn())}>Log in </Button>