import {FormGroup, Card, CardBody, Row, Col, Container, Input, Button, FormFeedback, Alert, Label, NavLink } from 'reactstrap';
import "../App.css"

function InputForm(props) {
    return (
        <FormGroup>
            <Label>
                {props.label}
            </Label>
            <Input
                type={props.type || 'text'}
                placeholder={props.placeholder || ''}
                name={props.name}
            />
        </FormGroup>
    )
}

const EditProfile = (props) => {
    const handleSubmit = () => {
        const data = {
            nickname: props.edit.nickname,
            firstname: props.edit.firstname,
            lastname: props.edit.lastname,
            email: props.edit.email,
            newpass: props.edit.newpass
        }
    }

        return (
            <section className="conteiner login">
                <Container>
                    <Row>
                        <Col md={6} className="m-auto">
                            <Card className="mb-4 shadow-sm">
                                <CardBody>
                                    <InputForm name='Login' label='Username' feedback='Invalid login' set={props.setLogin}/>
                                    <InputForm name='firstName' label='First name' feedback='Only symbols are required' set={props.setFirstName}/>
                                    <InputForm name='lastName' label='Last name' feedback='Only symbols are required' set={props.setLastName}/>
                                    <InputForm name='Email' label='Email' set={props.setEmail} feedback='Invalid email'/>
                                    <InputForm name='currentPass' type='password' label='Current password' placeholder="Current password" feedback='Too weak password. 8 symbols is required' />
                                    <InputForm name='newPass' type='password' label='New password' placeholder="New password" feedback='Too weak password. 8 symbols is required' set={props.setNewPassword} />
                                    <Button className="btn-success" type="submit" value="Save" onClick={handleSubmit} block>Save</Button>
                                    <div className="dropdown-divider"></div>
                                    <NavLink href='/user'>Back</NavLink>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section >
        );
}

export default EditProfile;