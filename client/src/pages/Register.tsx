import { useContext, useState } from "react";
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";

export default function Register() {

    const { updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        if (name && email && password) {
            const registerInfo = { name, email, password };
            updateRegisterInfo!(registerInfo);
        };
    };


    return (
        <>
            <Form onSubmit={registerUser}>
                <Row style={{
                    height: '100vh',
                    justifyContent: 'center',
                    paddingTop: '10%'
                }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Register</h2>
                            <Form.Control type="text" placeholder="Name" onChange={(e) => { setName(e.target.value) }} />
                            <Form.Control type="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
                            <Form.Control type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
                            <Button variant="primary" type="submit" onClick={handleRegister} >
                                {isRegisterLoading ? 'Creating Your Account.' : 'Register'}
                            </Button>
                            {
                                registerError?.message &&
                                <Alert variant="danger">
                                    <p>{registerError?.message}</p>
                                </Alert>
                            }
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
