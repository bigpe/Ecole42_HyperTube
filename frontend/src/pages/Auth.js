import React from "react";
import { Card, CardBody, Container, Row, Col, Button, FormGroup, Label, Input, NavLink, CardTitle} from 'reactstrap';
import {useDispatch} from "react-redux";
import {userLogIn} from "../actions/user";
//import "../App.css";
import logo_42 from "./42_logo.svg";
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';

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
    alert(
      `Failed to login. 😢`
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
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
                                            <Button className="login-btn" color="secondary"><img width={25} src={logo_42}></img></Button>
                                            <LoginGoogle/>
                                        </Col>
                                    </Row>                            
                                </div>
                                <form >
                                    <LoginInput/>
                                    <Password/>
                                    <Col>
                                        <Button className="login-btn" color="secondary" block>Sign in</Button>
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