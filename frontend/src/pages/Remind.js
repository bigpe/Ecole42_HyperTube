import React from 'react';
import { useState } from 'react';
import { Button, Col, Container, Input, Row, Card, CardBody, Label } from 'reactstrap';
import {connect} from "react-redux";
import {LangSelector} from "../selectors/common";
import { lang } from '../utils/location';
import {Link} from "react-router-dom";
import "../App.css";
import { getGetRequest } from "../utils/api";
import Info from "../components/Info/Info";

const Remind = ({langv}) => {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState(null);
    
    const remind = () => {
        getGetRequest(`/user/password/reset/?email=${email}`)
            .then((result) => {
                if (!result.data.error){
                    setMsg("Check your email!")
                    console.log(result);
                }
                console.log(result);
            })
    }
    
    return (
        <section className="conteiner login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card className="mb-4 shadow-sm">
                            <CardBody>
                                { msg && <Info message={msg} set={setMsg}/>}
                                <Col>
                                    <Label className="font-profile-head">
                                        {lang[langv].remindPas}
                                    </Label>
                                    <Input onChange={e => setEmail(e.target.value)}/>
                                    <Button className="remind-button" color='secondary' onClick={remind} block>{lang[langv].remindButton}</Button>
                                </Col>
                                <Col>
                                    <div className="dropdown-divider"></div>
                                    <Link to='/' >{lang[langv].back}</Link>
                                </Col>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section >
    )
}

const mapStateToProps = (state) => ({
    langv: LangSelector(state)
});

export default connect(mapStateToProps)(Remind);