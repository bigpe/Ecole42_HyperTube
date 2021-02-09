import React from 'react';
import { Button, Col, Container, Input, Row, Card, CardBody, Label } from 'reactstrap';
import "../App.css";
import {connect} from "react-redux";
import {LangSelector} from "../selectors/common";
import { lang } from '../utils/location';
import {Link} from "react-router-dom";

const Remind = ({langv}) => {
    /*
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState(null);
    const [isSuccess, setSuccess] = useState(null);
    const remind = () => {
        const data = {
            email: email
        }
       //запрос
    }
    */
    return (
        <section className="conteiner login">
            <Container>
                <Row>
                    <Col md={6} className="m-auto">
                        <Card className="mb-4 shadow-sm">
                            <CardBody>
                                <Col>
                                    <Label className="font-profile-head">
                                        {lang[langv].remindPas}
                                    </Label>
                                    <Input/>
                                    <Button className="remind-button" color='secondary' block>{lang[langv].remindButton}</Button>
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